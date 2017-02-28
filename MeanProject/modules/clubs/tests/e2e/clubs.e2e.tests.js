'use strict';

describe('Clubs E2E Tests:', function () {
  describe('Test clubs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/clubs');
      expect(element.all(by.repeater('club in clubs')).count()).toEqual(0);
    });
  });
});
