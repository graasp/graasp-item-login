import { generateRandomEmail } from './aux';

describe('Utils', () => {
  describe('generateRandomEmail', () => {
    it('Expect random emails', () => {
      const val1 = generateRandomEmail();
      const val2 = generateRandomEmail();
      const val3 = generateRandomEmail();

      expect(val1).not.toEqual(val2);
      expect(val1).not.toEqual(val3);
      expect(val2).not.toEqual(val3);
    });
  });
});
