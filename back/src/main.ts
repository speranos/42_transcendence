import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import * as cors from 'cors';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  const corsOptions = {
    origin: ['http://localhost:3001', 'http://localhost:3000', ],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization', 'credentials'],
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use(cookieParser());
  const config = new DocumentBuilder()
  .setTitle('Back end APIs')
  .setDescription('API description')
  .setVersion('1.0')
  .addTag('Transcendence')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
