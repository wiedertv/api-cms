import { Test, TestingModule } from '@nestjs/testing';
import { ContentFeedService } from './content-feed.service';

describe('ContentFeedService', () => {
  let service: ContentFeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentFeedService],
    }).compile();

    service = module.get<ContentFeedService>(ContentFeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
