// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
// import { Handlers } from '@sentry/node';
// import { NextFunction, Request, Response } from 'express';

// @Injectable()
// export class SentryMiddleware implements NestMiddleware {
//   constructor(@InjectSentry() private readonly sentryService: SentryService) {
//   }
//   use(req: Request, res: Response, next: NextFunction) {
//     this.sentryService.instance().configureScope(scope => {
//       scope.addEventProcessor(event => {
//         return Handlers.parseRequest(event, req);
//       });
//     });

//     next();
//   }
// }
import { Injectable, NestMiddleware } from '@nestjs/common';
import { SentryService } from '@ntegral/nestjs-sentry';
import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryMiddleware implements NestMiddleware {
  constructor(private readonly sentryService: SentryService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    Sentry.Handlers.requestHandler()(req, res, next); // Utiliza el manejador de solicitudes de Sentry

    const requestId = await this.sentryService.instance(); // Obtén el ID de la solicitud de Sentry

    (req as any).sentry = { // Add custom property 'sentry' to the 'Request' type
      requestId,
    };

    next();
  }
}