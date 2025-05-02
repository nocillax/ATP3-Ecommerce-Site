/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jarifchowdhury01@gmail.com',         // your Gmail
      pass: 'vokj sgdt torp pzrc',  // app password (not your Gmail password)
    },
  });

  async sendOrderConfirmation(to: string, subject: string, htmlBody: string): Promise<void> {
    await this.transporter.sendMail({
      from: '"Your Store" <your_email@gmail.com>',
      to,
      subject,
      html: htmlBody,
    });
  }
}
