import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/m1")
  async getHelloM1() {
    return this.appService.getHelloM1();
  }

  @Get("/m2")
  async getHelloM2() {
    return this.appService.getHelloM2();
  }
}
