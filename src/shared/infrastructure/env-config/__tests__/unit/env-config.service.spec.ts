import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigModule } from '../../env-config.module';
import { EnvConfigService } from '../../env-config.service';

describe('EnvConfigService unit tests', () => {
  // SUT (System Under Test)
  let sut: EnvConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule.forRoot({})],
    }).compile();

    sut = module.get<EnvConfigService>(EnvConfigService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return the port from the environment variable', () => {
    const port = sut.getAppPort();
    expect(port).toBe(3000);
  });

  it('should return the node environment from the environment variable', () => {
    const nodeEnv = sut.getNodeEnv();
    expect(nodeEnv).toBe('test');
  });
});
