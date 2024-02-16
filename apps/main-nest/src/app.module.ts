import { HttpException, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersModule } from './users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { SentryMiddleware } from './middlewares/sentry.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        })
      }),
    }),
    ClientsModule.register([
      {
        name: 'MAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'mails_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
    UsersModule,
    SentryModule.forRootAsync({
      useFactory: () => ({
        dsn: process.env.SENTRY_DNS,
        enabled: Boolean(process.env.SENTRY_ENABLED),
        environment: process.env.NODE_ENV,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useValue: new SentryInterceptor({
        filters: [
          {
            type: HttpException,
            filter: (exception: HttpException) => {
              return 500 > exception.getStatus();
            },
          },
        ],
      }),
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SentryMiddleware).forRoutes('*');
  }
}
