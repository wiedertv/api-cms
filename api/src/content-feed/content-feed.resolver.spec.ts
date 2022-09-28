import { Test, TestingModule } from '@nestjs/testing';
import { ContentFeedResolver } from './content-feed.resolver';

describe('ContentFeedResolver', () => {
  let resolver: ContentFeedResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentFeedResolver],
    }).compile();

    resolver = module.get<ContentFeedResolver>(ContentFeedResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
