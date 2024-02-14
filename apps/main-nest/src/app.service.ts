import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {

  constructor(@Inject('MAIL_SERVICE') private clientMail: ClientProxy) { }

  getHello(): string {
    return 'Hello World! main-nest app!';
  }

  newUser(user: any): string {

    this.clientMail.emit('new_email', user);
    return 'send_queue';

  }
}
