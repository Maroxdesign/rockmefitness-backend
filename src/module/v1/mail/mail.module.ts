import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { environment } from 'src/common/config/environment';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: environment.EMAIL.SERVICE,
        secure: true,
        auth: {
          user: environment.EMAIL.USERNAME,
          pass: environment.EMAIL.PASSWORD,
        },
      },
      defaults: {
        from: `"Figur" <noreply@figur.africa>`,
      },
      template: {
        dir: join(__dirname, 'template'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
