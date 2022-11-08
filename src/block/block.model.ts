import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Sequelize, Table } from "sequelize-typescript"
import { IBlockAdminAttributes, IBlockCreationAttributes } from "src/all.interface";

@Table({tableName: 'block'})
export class Block extends Model<Block, IBlockCreationAttributes> {

    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @ApiProperty({example: '1', description: 'Reference to member'})
    @Column({type: DataType.INTEGER, allowNull: false})
    ref_user: number;

    @ApiProperty({example: '{"name":"John Doe", "role":"user"}', description: "JSON model of user, who created block"})
    @Column({type: DataType.TEXT, allowNull: false})
    user_model: string;

    @ApiProperty({example: '1', description: 'Reference to page'})
    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
    ref_page: number;

    //Top-level: if approved "true", everybady can see block. On "false", just author see it.
    //Admin and moder blocks all time approved
    //
    //Replies: If approved "true", can be seen, can be replied.
    //If "false", content restricts like [censored], reply on it blocked, exists branch can be replied
    @ApiProperty({example: 'true|false', description: 'If block approved.'})
    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: true})
    approved: boolean;

    //"True" - replies to block and branch restricted. All levels.
    @ApiProperty({example: 'true|false', description: 'Closed, no responds available'})
    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    closed: boolean;

    //"True" - Nobody, except admin and moder (if "show deleted" mode turned off)
    //see block and branch below. All levels.
    @ApiProperty({example: 'true|false', description: 'Just admin and moder can see deleted block and branch under it.'})
    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    deleted: boolean;

    @ApiProperty({example: '{"type": "ad"|"review"}', description: ""})
    @Column({type: DataType.STRING, allowNull: false})
    type: string;

    @ApiProperty({example: 'Label', description: 'Label of the block'})
    @Column({type: DataType.STRING, allowNull: false})
    label: string;

    @ApiProperty({example: 'Text of ad block', description: 'Text of ad, review, article or so'})
    @Column({type: DataType.TEXT, allowNull: false})
    text: string;

    @ApiProperty({example: 'true|false', description: 'Stick at top of page'})
    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    sticky: boolean;

}

