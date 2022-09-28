import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledMessageService } from './scheduled-message.service';

describe('ScheduledMessageService', () => {
  let service: ScheduledMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduledMessageService],
    }).compile();

    service = module.get<ScheduledMessageService>(ScheduledMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
