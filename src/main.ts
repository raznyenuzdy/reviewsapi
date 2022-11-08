import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common';
import { InternalsFilter } from './internals.filter';
import { AppLogger } from './logger/logger.service';

async function bootstrap() {
    const PORT = process.env.PORT;
    const app = await NestFactory.create(AppModule, {
        // bufferLogs: true,
    });
    const { httpAdapter } = app.get(HttpAdapterHost);

    const config = new DocumentBuilder()
        .addBearerAuth({
            type: 'http',
            description: 'Auth0.com authorization management',
            name: 'Auth0 nextjs/react client side on popUp authorization',
            // in?: string;
            scheme: 'bearer',
            bearerFormat: 'JWT',
            // flows?: OAuthFlowsObject;
            // openIdConnectUrl?: string;
        })
        .setTitle('Reviews API')
        .setDescription('Documentation')
        .setVersion('1')
        .addTag('Reviews')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);
    app.setGlobalPrefix('api');
    app.enableCors(
        {
            origin: ['http://localhost:3000'],
            methods: ['POST', 'PUT', 'DELETE', 'GET', 'PATCH']
        }
    );
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new InternalsFilter());
    // app.useLogger(app.get(AppLogger));
    await app.listen(PORT, () => console.log(`Server started at port : ${PORT}`));
}

bootstrap();
