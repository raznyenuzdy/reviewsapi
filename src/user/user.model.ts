import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Sequelize, Table } from "sequelize-typescript"
import { IUserCreationAttributes } from "src/all.interface";

@Table({tableName: 'users'})
export class User extends Model<User, IUserCreationAttributes> {

    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @ApiProperty({example: 'auth0|****22065d9f46****cdaf20', description: 'Hashed string'})
    @Column({type: DataType.STRING, allowNull: false})
    user_id: string;

    @ApiProperty({example: 'user@domain.com', description: 'Valid email address'})
    @Column({type: DataType.STRING, allowNull: false})
    email: string;

    @ApiProperty({example: 'true|false', description: 'If email was verified'})
    @Column({type: DataType.STRING, allowNull: false})
    email_verified: boolean;

    @ApiProperty({example: 'John Doe', description: 'User full name'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @ApiProperty({example: 'JohnDoe', description: 'User nickname'})
    @Column({type: DataType.STRING, allowNull: false})
    nickname: string;

    @ApiProperty({example: 'Url', description: 'Url to avatar image'})
    @Column({type: DataType.STRING, allowNull: false})
    picture: string;

    @ApiProperty({example: 'gues|user|org|moderator|admin', description: 'User role'})
    @Column({type: DataType.STRING, allowNull: false})
    role: string;

    @ApiProperty({example: '2022-09-06T12:12:48.961Z', description: 'Creation time at authorization server'})
    @Column({type: DataType.DATE, allowNull: false})
    created_at: string;

    @ApiProperty({example: '2022-09-06T12:12:48.961Z', description: 'Update time at authorization server'})
    @Column({type: DataType.DATE, allowNull: true})
    updated_at: string;

    @ApiProperty({example: '2022-09-06T12:12:48.961Z', description: 'Last password reset time'})
    @Column({type: DataType.DATE, allowNull: true})
    last_password_reset: string;

    @ApiProperty({example: '127.0.0.1', description: 'Last IP'})
    @Column({type: DataType.STRING, allowNull: false})
    last_ip: string;

    @ApiProperty({example: '127.0.0.1', description: 'Last login time'})
    @Column({type: DataType.STRING, allowNull: false})
    last_login: string;

    @ApiProperty({example: '1', description: 'Logins count'})
    @Column({type: DataType.STRING, allowNull: false})
    logins_count: number;

    @ApiProperty({example: '7c7c95645bc5185a9ce1372dd2652a86', description: 'Token md5'})
    @Column({type: DataType.STRING, allowNull: false})
    md5: string;
}

//Will add stats table

