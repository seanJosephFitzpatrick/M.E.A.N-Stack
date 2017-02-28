'use strict';

describe('Foods E2E Tests:', function () {
  describe('Test foods page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/foods');
      expect(element.all(by.repeater('food in foods')).count()).toEqual(0);
    });
  });
});
