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
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,  
    },
  });

  async sendMail(to: string, subject: string, htmlBody: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"NCX" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlBody,
    });
  }
}
