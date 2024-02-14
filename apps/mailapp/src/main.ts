import { NestFactory } from '@nestjs/core';
import { MailappModule } from './mailapp.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(MailappModule);
  // await app.listen(3001);
  // console.log('mail app is running on port 3001');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MailappModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'mails_queue',
        queueOptions: {
          durable: false
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
