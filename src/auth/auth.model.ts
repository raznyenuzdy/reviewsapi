import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript"
import { User } from "src/user/user.model";

@Table({ tableName: 'auth' })
export class Auth extends Model<Auth> {

    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @ApiProperty({ example: '3429756920346512067', description: 'Token' })
    @Column({ type: DataType.STRING, allowNull: true })
    token: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    ref_user: number;

    @BelongsTo(() => User, 'ref_user')
    user: User;
}