import { Test, TestingModule } from '@nestjs/testing';
import { MailerSettingsResolver } from './mailer-settings.resolver';

describe('MailerSettingsResolver', () => {
  let resolver: MailerSettingsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerSettingsResolver],
    }).compile();

    resolver = module.get<MailerSettingsResolver>(MailerSettingsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
