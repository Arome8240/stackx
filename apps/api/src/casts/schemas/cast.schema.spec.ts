import { Cast, CastSchema } from './cast.schema';

describe('CastSchema', () => {
  it('should have required fields defined', () => {
    const schemaPaths = CastSchema.paths;
    expect(schemaPaths).toHaveProperty('author');
    expect(schemaPaths).toHaveProperty('content');
    expect(schemaPaths).toHaveProperty('likesCount');
    expect(schemaPaths).toHaveProperty('recastsCount');
    expect(schemaPaths).toHaveProperty('repliesCount');
    expect(schemaPaths).toHaveProperty('tipsTotal');
    expect(schemaPaths).toHaveProperty('deleted');
  });

  it('should have content max length of 320', () => {
    const contentPath = CastSchema.paths['content'] as any;
    expect(contentPath.options.maxlength).toBe(320);
  });

  it('should set default values', () => {
    const defaults = {
      likesCount: CastSchema.paths['likesCount'].options.default,
      repliesCount: CastSchema.paths['repliesCount'].options.default,
      deleted: CastSchema.paths['deleted'].options.default,
    };
    expect(defaults.likesCount).toBe(0);
    expect(defaults.repliesCount).toBe(0);
    expect(defaults.deleted).toBe(false);
  });
});
