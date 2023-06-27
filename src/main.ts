import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { environment } from './common/config/environment';
import { RequestGuard } from './common/utils/guards';
import helmet from 'helmet';
import { TransformationInterceptor } from './common/interceptor/response.interceptor';
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor';
import { HttpExceptionFilter } from './common/filter/filter';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(helmet());
  app.useWebSocketAdapter(new IoAdapter(app));
  // app.use(express.json({ limit: '50mb' }));
  // app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // guards
  app.useGlobalGuards(new RequestGuard());

  // interceptors
  app.useGlobalInterceptors(
    new TransformationInterceptor(app.get(Reflector)),
    new TimeoutInterceptor(),
  );

  // filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // prefix
  app.setGlobalPrefix('/api/v1');

  // pipeline validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(environment.APP.PORT || 3000);
}
bootstrap();
