import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    throw new Error('Custom error 4');
    // throw new NotFoundException('Not Found error');
    return this.appService.getHello();
  }


  @Post()
  newUser(@Body() body: any): string {
    throw new Error('New User Custom error 4');
    return this.appService.newUser(body)
  }

}
