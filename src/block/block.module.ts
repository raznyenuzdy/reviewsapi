import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoggerModule } from 'src/logger/logger.module';
import { BlockController } from './block.controller';
import { Block } from './block.model';
import { UserModule } from 'src/user/user.module';
import { BlockService } from './block.service';

@Module({
    controllers: [BlockController],
    providers: [BlockService, ConfigService],
    imports: [
        LoggerModule,
        UserModule,
        SequelizeModule.forFeature([Block]),
    ],
    exports: [BlockService]
})
export class BlockModule { }
