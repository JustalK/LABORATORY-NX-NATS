/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

 import { Transport, MicroserviceOptions } from '@nestjs/microservices';
 import { NestFactory } from '@nestjs/core';
 import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ['nats://nats:4222'],
        queue: 'microservice2_queue',
      },
    },
  );
  await app.listen();
}

bootstrap();
