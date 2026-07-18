import { toErrorMessage, isError, toError } from '../errors';
import { ERROR_MESSAGES } from '../constants';

describe('Error Utilities', () => {
  describe('toErrorMessage', () => {
    it('should extract message from Error object', () => {
      expect(toErrorMessage(new Error('test error'))).toBe('test error');
    });

    it('should return string directly', () => {
      expect(toErrorMessage('string error')).toBe('string error');
    });

    it('should return fallback message for unknown types', () => {
      expect(toErrorMessage(null)).toBe(ERROR_MESSAGES.UNKNOWN_ERROR);
      expect(toErrorMessage({})).toBe(ERROR_MESSAGES.UNKNOWN_ERROR);
      expect(toErrorMessage(123)).toBe(ERROR_MESSAGES.UNKNOWN_ERROR);
    });
  });

  describe('isError', () => {
    it('should return true for Error instances', () => {
      expect(isError(new Error())).toBe(true);
      expect(isError(new TypeError())).toBe(true);
    });

    it('should return false for non-Error instances', () => {
      expect(isError('error')).toBe(false);
      expect(isError(null)).toBe(false);
      expect(isError({})).toBe(false);
    });
  });

  describe('toError', () => {
    it('should return the same Error instance if passed an Error', () => {
      const err = new Error('test');
      expect(toError(err)).toBe(err);
    });

    it('should wrap string in Error instance', () => {
      const err = toError('string error');
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('string error');
    });

    it('should fallback to default error for unknown types', () => {
      const err = toError(null);
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe(ERROR_MESSAGES.UNKNOWN_ERROR);
    });
  });
});
