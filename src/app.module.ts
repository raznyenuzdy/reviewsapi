import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';
import { UserModule } from './user/user.module';
import { CheckRoleMiddleware } from './check-role.middleware';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from './logger/logger.module';
import { BlockModule } from './block/block.module';
import { Block } from './block/block.model';
import { Auth } from './auth/auth.model';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
            isGlobal: true,
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Auth, Block],
            autoLoadModels: true,
            synchronize: true,
        }),
        HttpModule,
        UserModule,
        BlockModule,
        LoggerModule,
    ],
    controllers: [],
    providers: [
        // {
        //     provide: APP_FILTER,
        //     useClass: InternalsFilter,
        // },
        // {
        //     provide: APP_GUARD,
        //     useClass: AuthorizationGuard,
        // }
    ],
})

export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(CheckRoleMiddleware)
          .exclude(
            { path: '/api/block/:id', method: RequestMethod.GET },
          )
          .forRoutes('*');
      }
}
