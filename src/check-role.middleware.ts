import { Injectable, InternalServerErrorException, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { expressjwt as jwt } from "express-jwt";
import { expressJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UserDto } from './user/dto/user.dto';
import { IUserCreationAttributes } from './all.interface';

interface _payLoad {
    iss: string,
    sub: string,
    aud: [string],
    iat: number,
    exp: number,
    azp: string,
    scope: string
}

@Injectable()
export class CheckRoleMiddleware implements NestMiddleware {

    private AUTH0_AUDIENCE: string;
    private AUTH0_DOMAIN: string;
    private AUTH0_API_TOKEN: string;

    constructor(
        private configService: ConfigService,
        private userService: UserService,
        private jwtService: JwtService,
        private httpService: HttpService,
    ) {
        this.AUTH0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE');
        this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN');
        this.AUTH0_API_TOKEN = this.configService.get('AUTH0_API_TOKEN');
    }

    adjustUserData(Member: any, userData:any) {
        return {
            id: Member.id,
            user_id: userData.user_id || Member.user_id,
            email: userData.email || Member.email,
            email_verified: userData.email_verified || Member.email_verified,
            name: userData.name || Member.name,
            nickname: userData.nickname || Member.nickname,
            picture: userData.picture || Member.picture,
            role: Member.role,
            created_at: userData.created_at || Member.created_at,
            updated_at: userData.updated_at || Member.updated_at,
            last_password_reset: userData.last_password_reset || Member.last_password_reset,
            last_ip: userData.last_ip || Member.last_ip,
            last_login: userData.last_login || Member.last_login,
            logins_count: userData.logins_count || Member.logins_count,
            createdAt: userData.createdAt || Member.createdAt,
            updatedAt: userData.updatedAt || Member.updatedAt,
        };
    }

    async reMember(obj: any, next: () => void) {
        //find registered member at db
        const Member = await this.userService.testMember(obj);
        //if found and registered as authorized
        if (Member && this.userService.checkActualityAuth(Member)) {
            //then ok
            return next();
        }
        return Member;
    }

    async use(req: Request | any, res: Response, next: NextFunction) {
        try {
            const ip = req.ip.toString().replace('::ffff:', '').replace('::1', '');
            const jwtoken = req.headers['authorization']?.replace('Bearer ', '');
            if (!jwtoken) {
                Logger.error('Member not authorized. Code: U004: token not provided');
                return next(new UnauthorizedException('Member not authorized. Code: U004'));
            }
            const payLoad = this.jwtService.decode(jwtoken, { json: true }) as _payLoad;
            if (!payLoad) {
                Logger.error('Member not authorized. Code: U006: payload not extracted from token:', jwtoken);
                return next(new UnauthorizedException('Member not authorized. Code: U006'));
            }
            const crypto = require('crypto');
            const tokenMd5 = crypto.createHash('md5').update(jwtoken).digest("hex");
            const objAuth0 = { ip, user_id: payLoad.sub, md5: tokenMd5 };
            //find registered member at db
            const Member = await this.userService.testMember(objAuth0);
            const ifActual = this.userService.checkActualityAuth(Member);
            //if found and registered as authorized
            if (ifActual) {
                //then ok
                req.userData = this.adjustUserData(Member, {})
                return next();
            // } else {
                // const Member = await this.userService.updateUser(Member);
                // req.userData = this.adjustUserData(objAuth0, {})
            }
            //else need to proof it at auth0
            jwt({
                secret: expressJwtSecret({
                    cache: true,
                    rateLimit: true,
                    jwksRequestsPerMinute: 5,
                    jwksUri: `${this.AUTH0_DOMAIN}/.well-known/jwks.json`,
                }) as any,
                audience: `${this.AUTH0_AUDIENCE}`,
                issuer: `${this.AUTH0_DOMAIN}/`,
                algorithms: ['RS256'],
            })(req, res, async (error: any) => next(error ?
                new UnauthorizedException('Member not authorized. Code: U003') :
                await this.adjustMember(req, res, next, payLoad, Member, objAuth0))
            );
            //if all approved by auth0, apply payload to db
        } catch (error) {
            console.log(error);
            Logger.error(error);
            next(new InternalServerErrorException(error));
        }
    }

    /*
    Auth0.com : Applications -> Apis -> Auth0 Management API -> Token
    for dev, have use other logick, with token request
    */
    async adjustMember(req: Request | any, res: Response, next: any, payLoad: _payLoad, User: IUserCreationAttributes, obj: any) {
        try {
            //proof member's token
            const resp: any = await this.callApi(payLoad);
            //if auth0 approved token, mean at front-end, user valid, can be error case, when at db, user somewhy disappeared
            //this just managed exception
            if (!resp?.data) return next(new UnauthorizedException('User not authorized. Code: U008'));
            if (!User) {
                //register approved by auth0 user to db
                User = await this.userService.createGuest(new UserDto({...resp.data, md5: obj.md5}));
                //find registered member at db
            }
            if (!User) return next(new UnauthorizedException('User not authorized. Code: U009'));
            //if found and registered as authorized
            if (!this.userService.checkActualityAuth(User)) {
                await this.userService.updateUser(User);
            }
            if (this.userService.checkActualityAuth(User)) {
                req.userData = this.adjustUserData(resp.data, User);
                return;
            }
            next(new UnauthorizedException('User not authorized. Code: U007'));
        } catch (error: any) {
            console.log("Error: adjustMember:", error);
            Logger.error("Error: adjustMember:", error);
            next(new InternalServerErrorException(error));
        }
    }

    async callApi(payLoad: _payLoad) {
        const options = {
            method: 'GET',
            url: `${this.AUTH0_DOMAIN}/api/v2/users/${payLoad.sub}`,
            headers: { authorization: `Bearer ${this.AUTH0_API_TOKEN}` },
            params: {
                // fields:'name,email',
                // include_fields: true
            }
        }
        const obs = this.httpService.request(options);
        const a = await firstValueFrom(obs);
        return a;
    }
}
