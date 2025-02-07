import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('MoviieBooker API')
    .setDescription('API de réservation de films')
    .setVersion('1.0')
    .addBearerAuth() 
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',  
    allowedHeaders: 'Content-Type, Authorization',  
  });

  app.enableCors({
    origin: 'https://asaad.alwaysdata.net/',
    methods: 'GET,POST,PUT,DELETE',  
    allowedHeaders: 'Content-Type, Authorization',  
  });
  await app.listen(3000);


  await app.listen(3000);


}

bootstrap();
