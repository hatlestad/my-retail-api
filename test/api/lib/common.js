import { expect } from 'chai';

import * as common from '../../../api/lib/common';

describe('Library common', () => {

  describe('isValidProductId', () => {
    it('returns false if argument is 0', () => {
      const result = common.isValidProductId(0);
      expect(result).to.be.false;
    });

    it('returns false if argument is a negative number', () => {
      const result = common.isValidProductId(-1);
      expect(result).to.be.false;
    });

    it('returns false if argument contains characters', () => {
      const result = common.isValidProductId('123ABC123');
      expect(result).to.be.false;
    });

    it('returns false if argument contains characters', () => {
      const result = common.isValidProductId('123ABC123');
      expect(result).to.be.false;
    });

    it('returns false if argument contains only numbers and has 7 characters', () => {
      const result = common.isValidProductId(1234567);
      expect(result).to.be.false;
    });

    it('returns false if argument contains only numbers and has 9 characters', () => {
      const result = common.isValidProductId(123456789);
      expect(result).to.be.false;
    });

    it('returns true if argument contains only numbers and has 8 characters', () => {
      const result = common.isValidProductId(12345678);
      expect(result).to.be.true;
    });
  });

});