import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('MICROSERVICE1') private client1: ClientProxy,
    @Inject('MICROSERVICE2') private client2: ClientProxy
  ){}

  async getHelloM1(){
    return this.client1.send({cmd: 'greeting'}, 'Micro1');
  }

  async getHelloM2() {
    return this.client2.send({cmd: 'greeting'}, 'Micro2');
  }
}
