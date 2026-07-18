import { sanitizeInput } from '../sanitize';

describe('sanitizeInput', () => {
  it('should trim whitespace from start and end', () => {
    expect(sanitizeInput('  hello world  ')).toBe('hello world');
  });

  it('should remove HTML tags completely', () => {
    expect(sanitizeInput('<script>alert(1)</script>hello')).toBe('alert(1)hello');
    expect(sanitizeInput('<b>bold</b> text')).toBe('bold text');
  });

  it('should return clean text unmodified', () => {
    expect(sanitizeInput('normal text 123 !@#')).toBe('normal text 123 !@#');
  });

  it('should throw RangeError if output exceeds maxLength', () => {
    expect(() => sanitizeInput('abcd', 3)).toThrow(RangeError);
  });

  it('should not throw if output is equal to maxLength', () => {
    expect(sanitizeInput('abc', 3)).toBe('abc');
  });
});
