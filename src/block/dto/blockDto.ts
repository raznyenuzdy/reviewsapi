import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IBlockAdminAttributes, IBlockCreationAttributes } from "src/all.interface";

//количество отображаемых блоков по дефолту
export class BlockDto implements IBlockCreationAttributes {
    @IsNotEmpty() id: number;
    @IsNotEmpty() ref_user: number;
    @IsNotEmpty() user_model: string;
    @IsNotEmpty() ref_page: number;
    @IsNotEmpty() approved: boolean;
    @IsNotEmpty() closed: boolean;
    @IsNotEmpty() deleted: boolean;
    @IsNotEmpty() type: string;
    @IsNotEmpty() label: string;
    @IsNotEmpty() text: string;

    constructor(dto: IBlockCreationAttributes) {
        this.ref_user = dto.ref_user;
        this.user_model = dto.user_model || '';
        this.ref_page = dto.ref_page || 0;
        this.approved = dto.approved || true;
        this.closed = dto.closed || false;
        this.deleted = dto.deleted || false;
        this.type = dto.type || '';
        this.label = dto.label || '';
        this.text = dto.text || '';
    }
}

export class BlockAdminDto implements IBlockAdminAttributes {
    @IsNotEmpty() approved: boolean;
    @IsNotEmpty() closed: boolean;
    @IsNotEmpty() deleted: boolean;

    constructor(dto: IBlockAdminAttributes) {
        this.approved = dto.approved;
        this.closed = dto.closed;
        this.deleted = dto.deleted;
    }
}