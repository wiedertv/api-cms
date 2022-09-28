import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledMessageResolver } from './scheduled-message.resolver';

describe('ScheduledMessageResolver', () => {
  let resolver: ScheduledMessageResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduledMessageResolver],
    }).compile();

    resolver = module.get<ScheduledMessageResolver>(ScheduledMessageResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
