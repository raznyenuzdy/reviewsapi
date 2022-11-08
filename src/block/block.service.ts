import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { IBlockAdminAttributes, IBlockCreationAttributes } from 'src/all.interface';
import { Block } from './block.model';
import { BlockAdminDto, BlockDto } from './dto/blockDto';
import { UserService } from '../user/user.service';
import { GetUserDto } from 'src/user/dto/user.dto';

@Injectable()
export class BlockService {

    constructor(@InjectModel(Block) private blockRepository: typeof Block,
        private configService: ConfigService,
        private userService: UserService
    ) {

    }

    async createBlock(dto: any): Promise<Block> {
        try {
            const data = new BlockDto(dto);
            const row: any = await this.blockRepository.create(data);
            return row.dataValues;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    async updateBlockAdmin(id: number, dto: IBlockAdminAttributes) {
        try {
            const data = new BlockAdminDto(dto);
            console.log(data);
            const row: any = await this.blockRepository.update(data, {
                where: { id }
            });
            return await this.getBlock(id);
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    async getBlock(id: number) {
        try {
            const obj = await this.blockRepository.findOne({ where: { id } });
            return obj ? obj.get({ plain: true }) : null;
        } catch (error) {
            throw error;
        }
    }

    async adjustRow(row: any) {
        try {
            let user_model = (({ id, name, nickname, picture, role }) => ({ id, name, nickname, picture, role }))(JSON.parse(row.user_model || "{}"));
            const user = await this.userService.getUserById(row.ref_user);
            if (user) {
                user_model = {id: user.user_id, name: user.name, nickname: user.nickname, picture: user.picture, role: user.role };
            }
            return { ...row, user_model };
        } catch (error) {
            //usualy brocken user data, so comment rejecys
            Logger.error(error);
        }
    }

    async getBlocks(page: string = '0') {
        try {
            const count = this.configService.get('PER_PAGE');
            const start = parseInt(page) * count;
            const obj = await this.blockRepository.findAll({
                limit: count,
                offset: start,
                order: [
                    ['id', 'DESC'],
                ],
            });
            const rows = obj.map(el => el.get({ plain: true }));
            //filter brocken rows
            return await Promise.all(rows.map(async (row) => {const a = await this.adjustRow(row); return a}).filter(row => row));
        } catch (error) {
            throw error;
        }
    }

}
