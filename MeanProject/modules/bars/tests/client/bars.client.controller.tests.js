'use strict';

(function () {
  // Bars Controller Spec
  describe('Bars Controller Tests', function () {
    // Initialize global variables
    var BarsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Bars,
      mockBar;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Bars_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Bars = _Bars_;

      // create mock bar
      mockBar = new Bars({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Bar about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Bars controller.
      BarsController = $controller('BarsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one bar object fetched from XHR', inject(function (Bars) {
      // Create a sample bars array that includes the new bar
      var sampleBars = [mockBar];

      // Set GET response
      $httpBackend.expectGET('api/bars').respond(sampleBars);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.bars).toEqualData(sampleBars);
    }));

    it('$scope.findOne() should create an array with one bar object fetched from XHR using a barId URL parameter', inject(function (Bars) {
      // Set the URL parameter
      $stateParams.barId = mockBar._id;

      // Set GET response
      $httpBackend.expectGET(/api\/bars\/([0-9a-fA-F]{24})$/).respond(mockBar);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.bar).toEqualData(mockBar);
    }));

    describe('$scope.craete()', function () {
      var sampleBarPostData;

      beforeEach(function () {
        // Create a sample bar object
        sampleBarPostData = new Bars({
          title: 'An Bar about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Bar about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Bars) {
        // Set POST response
        $httpBackend.expectPOST('api/bars', sampleBarPostData).respond(mockBar);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the bar was created
        expect($location.path.calls.mostRecent().args[0]).toBe('bars/' + mockBar._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/bars', sampleBarPostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock bar in scope
        scope.bar = mockBar;
      });

      it('should update a valid bar', inject(function (Bars) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/bars\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/bars/' + mockBar._id);
      }));

      it('should set scope.error to error response message', inject(function (Bars) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/bars\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(bar)', function () {
      beforeEach(function () {
        // Create new bars array and include the bar
        scope.bars = [mockBar, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/bars\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockBar);
      });

      it('should send a DELETE request with a valid barId and remove the bar from the scope', inject(function (Bars) {
        expect(scope.bars.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.bar = mockBar;

        $httpBackend.expectDELETE(/api\/bars\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to bars', function () {
        expect($location.path).toHaveBeenCalledWith('bars');
      });
    });
  });
}());
