import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MICROSERVICE1',
        transport: Transport.NATS,
        options: {
          servers: ['nats://nats:4222'],
          queue: 'microservice1_queue',
        },
      },
      {
        name: 'MICROSERVICE2',
        transport: Transport.NATS,
        options: {
          servers: ['nats://nats:4222'],
          queue: 'microservice2_queue',
        },
      },
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
