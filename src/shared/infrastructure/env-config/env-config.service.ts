import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './env-config.interface';

@Injectable()
export class EnvConfigService implements EnvConfig {
  constructor(private readonly configService: ConfigService) {}

  getAppPort(): number {
    const numberPort = this.configService.get<number>('PORT');
    return Number(numberPort);
  }
  getNodeEnv(): string {
    const nodeEnv = this.configService.get<string>('NODE_ENV') as string;
    return nodeEnv;
  }
}
