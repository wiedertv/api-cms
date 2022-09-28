import { Test, TestingModule } from '@nestjs/testing';
import { MagazineResolver } from './magazine.resolver';

describe('MagazineResolver', () => {
  let resolver: MagazineResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MagazineResolver],
    }).compile();

    resolver = module.get<MagazineResolver>(MagazineResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
