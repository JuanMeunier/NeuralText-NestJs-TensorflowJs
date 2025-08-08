import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita la validación automática de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger MEJORADA
  const config = new DocumentBuilder()
    .setTitle('Neural Text API') // ← CAMBIAR EL TÍTULO
    .setDescription('API de análisis de texto usando modelos de IA para sentimientos, emociones, entidades e intenciones')
    .setVersion('1.0')
    .addBearerAuth() // ← AGREGAR SOPORTE PARA JWT
    .addTag('Auth', 'Endpoints de autenticación con Google OAuth')
    .addTag('Users', 'Gestión de perfiles de usuario')
    .addTag('Text Analysis', 'Análisis de texto con modelos de IA')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 API corriendo en: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 Documentación en: http://localhost:${process.env.PORT ?? 3000}/api`);
}

bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
});