import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Eu estou aprendendo NestJS com Fastify!';
  }
}
