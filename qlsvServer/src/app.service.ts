import { Injectable } from '@nestjs/common';

import { compare, hash } from 'bcrypt';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
