import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { join } from 'path';
import { EnvConfigService } from './env-config.service';

@Module({
  providers: [EnvConfigService],
  imports: [ConfigModule],
})
export class EnvConfigModule {
  static forRoot(options: ConfigModuleOptions): DynamicModule {
    return {
      module: EnvConfigModule,
      providers: [EnvConfigService],
      exports: [EnvConfigService],
      imports: [
        ConfigModule.forRoot({
          ...options,
          isGlobal: true,
          envFilePath: [
            join(__dirname, `../../../../.env.${process.env.NODE_ENV}`),
          ],
        }),
      ],
    };
  }
}
