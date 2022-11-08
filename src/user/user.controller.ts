import { Body, Headers, Controller, Delete, Get, Res, HttpException, HttpStatus, Param, Patch, Post, UseFilters, UseGuards, UseInterceptors, UnauthorizedException, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiCreatedResponse, ApiTags, ApiOkResponse, ApiBadRequestResponse, ApiProduces, ApiBody, ApiNoContentResponse, ApiAcceptedResponse, ApiSecurity, ApiBearerAuth, ApiParam, ApiUnauthorizedResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { User } from './user.model';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { UserDto, GetUserDto, BadRequest } from './dto/user.dto';
import { JWT, UserData } from './user.decorator';
import { InternalsFilter } from 'src/internals.filter';
import { IUserCreationAttributes } from 'src/all.interface';

@ApiTags('Users')
@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }

    @ApiOperation({ summary: "Get member role" })
    @ApiOkResponse({ description: "Get member if exists, if absent, create it. Creation is transparent.", status: HttpStatus.OK, type: UserDto })
    @ApiUnauthorizedResponse({ description: "Member not authorized. Code: U###", status: HttpStatus.UNAUTHORIZED })
    @ApiInternalServerErrorResponse({
        description: "Internal server error. Code: I0##",
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        schema: {
            example: {
                "name": "InternalServerErrorException",
                "message": "Internal server error. Code: I001",
                "statusCode": 500,
                "timestamp": "2022-10-01T13:42:04.187Z",
                "path": "/api/user/auth0|****22065d9f46****cdaf20"
            }
        }
    })
    @ApiBearerAuth("Authorization")
    @ApiSecurity("bearerAuth")
    @ApiProduces("application/json")
    @ApiParam({ name: 'id', type: 'string', example: 'auth0|****22065d9f46****cdaf20' })
    @ApiResponse({ status: HttpStatus.OK, type: User })
    @UseFilters(new InternalsFilter())
    @Get("/:id") //id uses at auth middleware
    async get(@UserData() userData: IUserCreationAttributes) {
        if (!userData) {
            throw new UnauthorizedException('Member not authorized. Code: U001');
        }
        let Member: any;
        try {
            Member = await this.userService.getMemberByUserId({ user_id: userData.user_id } as GetUserDto);
            Member = Member ? Member : await this.userService.createGuest(userData);
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException('Internal server error. Code: I001');
        }
        if (Member) {
            return Member;
        }
        throw new UnauthorizedException('Member not registered. Code: U002');
    }

    /*
    Will be needed as callback at after create user auth0 functionality
    */
    @ApiOperation({ summary: "Add new member record" })
    @ApiCreatedResponse({ description: "Create 'Guest' type of user", status: HttpStatus.CREATED, type: UserDto })
    @ApiNoContentResponse({ description: "User already exists", status: HttpStatus.NO_CONTENT, type: UserDto })
    @ApiBadRequestResponse({ description: "Bad request", status: HttpStatus.BAD_REQUEST, type: BadRequest })
    @ApiBearerAuth("Authorization")
    @ApiSecurity("bearerAuth")
    @ApiBody({
        type: UserDto,
        description: 'Create user request',
    })
    @ApiProduces("application/json")
    @ApiResponse({ status: HttpStatus.CREATED, type: User })
    @Post()
    async create(@Body() memberDto: UserDto, @Res() res: Response, @Headers('Authorization') auth: string) {
        try {
            if (!res.locals.userData) {
                memberDto.role = 'guest';
            }
            // const { New, Old } = await this.userService.createGuest(memberDto);
            // if (New) {
            //     return New;
            // } else {
            //     return new HttpException('User already exists', HttpStatus.NO_CONTENT);
            // }
        } catch (error) {
            throw new HttpException('User hasn\'t been registered', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: "Transform 'guest' user type to 'User' user type" })
    @ApiResponse({ status: 200, type: User })
    @Patch('updateToUser')
    async updateToUser(@Body() userDto: UserDto) {
        // const checkedUser = this.userService.checkGuestExists(userDto);
        // if (!checkedUser) {
        //     return this.userService.createGuest(userDto);
        // } else {
        //     throw new HttpException('User not found', 404);
        // }
    }

    @Patch(':id')
    async patch(@Param('id') id: string, @Body() dto: string) {

    }

    @Delete(':id')
    async delete(@Param('id') id: string) {

    }
}
