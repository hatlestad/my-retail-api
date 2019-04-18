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

  describe('isValidBody', () => {
    const body = { id: 1234, name: 'John' };

    it('returns an empty string when body is empty', () => {
      const result = common.isValidBody({});
      expect(result).to.equal('');
    });

    it('returns an empty string when validProperties is empty', () => {
      const result = common.isValidBody({}, []);
      expect(result).to.equal('');
    })

    it('returns missing value in string when body is missing one value', () => {
      const result = common.isValidBody(body, ['id', 'name', 'rando']);
      expect(result).to.equal('rando');
    });

    it('returns missing values in string when body is missing more than one value', () => {
      const result = common.isValidBody(body, ['id', 'name', 'rando', 'other']);
      expect(result).to.equal('rando, other');
    });

    it('returns missing value in string even when body contains additional properties than what are required', () => {
      const result = common.isValidBody({ ...body, additional: 'prop' }, ['id', 'name', 'rando']);
      expect(result).to.equal('rando');
    });
  });

});