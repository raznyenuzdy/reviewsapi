import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IUserCreationAttributes } from "src/all.interface";

export class UserDto implements IUserCreationAttributes{

    @ApiProperty({example: '1', description: 'Auth0 user id'})
    @IsNotEmpty() id: number;

    @ApiProperty({example: 'auth0|****22065d9f46****cdaf20', description: 'Auth0 user id'})
    @IsNotEmpty() user_id: string;

    @ApiProperty({ example: 'email@domain.com', description: 'e-mail' })
    @IsEmail() @IsNotEmpty() email: string;

    @ApiProperty({ example: 'email@domain.com', description: 'Is e-mail verified?' })
    @IsNotEmpty() email_verified: boolean;

    @ApiProperty({ example: 'John Doe', description: 'Full name' })
    @IsNotEmpty() name: string;

    @ApiProperty({ example: 'JohnDoe', description: 'Nick name' })
    @IsNotEmpty() nickname: string;

    @ApiProperty({example: 'Url', description: 'Url to avatar image'})
    picture: string;

    @ApiProperty({ example: 'user|org|admin', description: 'role' })
    role?: string;

    @ApiProperty({example: '2022-09-06T12:12:48.961Z', description: 'Update time at authorization server'})
    created_at: string;

    @ApiProperty({example: '2022-09-06T12:12:48.961Z', description: 'Update time at authorization server'})
    updated_at: string;

    @ApiProperty({example: '2022-09-06T12:12:48.961Z', description: 'User full name'})
    last_password_reset: string;

    @ApiProperty({example: '127.0.0.1', description: 'Last IP'})
    last_ip: string;

    @ApiProperty({example: '127.0.0.1', description: 'Last IP'})
    last_login: string;

    @ApiProperty({example: '127.0.0.1', description: 'Last IP'})
    logins_count: number;

    @ApiProperty({example: '7c7c95645bc5185a9ce1372dd2652a86', description: 'Token md5'})
    md5: string;

    constructor(dto: IUserCreationAttributes) {
        this.user_id = dto.user_id;
        this.email = dto.email;
        this.email_verified = dto.email_verified || false;
        this.name = dto.name;
        this.nickname = dto.nickname;
        this.picture = dto.picture || '';
        this.role = dto.role || '';
        this.created_at = dto.created_at || '';
        this.updated_at = dto.updated_at || '';
        this.last_password_reset = dto.last_password_reset || '';
        this.last_ip = dto.last_ip || '';
        this.last_login = dto.last_login || '';
        this.logins_count = dto.logins_count || 0;
        this.md5 = dto.md5 || '';
    }

}

export class BadRequest {
    @ApiProperty({ example: '400', description: 'full name' })
    statusCode: number;

    @ApiProperty({ example: "Bad Request" })
    error: string;

    @ApiProperty({ example: ["email must be an email", "email should not be empty"] })
    message: []
}

export class GetUserDto {
    @ApiProperty({ example: 'auth0|****22065d9f4*****cdaf20', description: 'Auth0 user_id field' })
    @IsNotEmpty() user_id: string;
}

export class TestUserDto {
    @ApiProperty({ example: 'auth0|****22065d9f4*****cdaf20', description: 'Auth0 user_id field' })
    @IsNotEmpty() user_id: string;

    @ApiProperty({ example: '127.0.0.1', description: 'Auth0 last user login ip' })
    @IsNotEmpty() ip: string;

    @ApiProperty({ example: '7c7c95645bc5185a9ce1372dd2652a86', description: 'Token md5 sum' })
    @IsNotEmpty() md5: string;
}