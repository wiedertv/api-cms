import { Test, TestingModule } from '@nestjs/testing';
import { MailerSettingsService } from './mailer-settings.service';

describe('MailerSettingsService', () => {
  let service: MailerSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerSettingsService],
    }).compile();

    service = module.get<MailerSettingsService>(MailerSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
