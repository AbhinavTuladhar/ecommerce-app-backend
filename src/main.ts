import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { SuccessChangeInterceptor } from './interceptors/success-change/success-change.interceptor';
import { SuccessResponseInterceptor } from './interceptors/success-response/success-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('A beginner backend project')
    .setVersion('1.0')
    .addTag('e-commerce')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(
    new SuccessResponseInterceptor(),
    new SuccessChangeInterceptor(app.get(Reflector))
  );
  await app.listen(3000);
}
bootstrap();
