import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { User } from './user.model';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
    controllers: [UserController],
    providers: [UserService, JwtService, ConfigService],
    imports: [
        LoggerModule,
        SequelizeModule.forFeature([User]),
    ],
    exports: [UserService, JwtService]
})

export class UserModule { }
