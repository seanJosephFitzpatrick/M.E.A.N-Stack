'use strict';

(function () {
  // Foods Controller Spec
  describe('Foods Controller Tests', function () {
    // Initialize global variables
    var FoodsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Foods,
      mockFood;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Foods_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Foods = _Foods_;

      // create mock food
      mockFood = new Foods({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Food about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Foods controller.
      FoodsController = $controller('FoodsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one food object fetched from XHR', inject(function (Foods) {
      // Create a sample foods array that includes the new food
      var sampleFoods = [mockFood];

      // Set GET response
      $httpBackend.expectGET('api/foods').respond(sampleFoods);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.foods).toEqualData(sampleFoods);
    }));

    it('$scope.findOne() should create an array with one food object fetched from XHR using a foodId URL parameter', inject(function (Foods) {
      // Set the URL parameter
      $stateParams.foodId = mockFood._id;

      // Set GET response
      $httpBackend.expectGET(/api\/foods\/([0-9a-fA-F]{24})$/).respond(mockFood);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.food).toEqualData(mockFood);
    }));

    describe('$scope.craete()', function () {
      var sampleFoodPostData;

      beforeEach(function () {
        // Create a sample food object
        sampleFoodPostData = new Foods({
          title: 'An Food about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Food about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Foods) {
        // Set POST response
        $httpBackend.expectPOST('api/foods', sampleFoodPostData).respond(mockFood);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the food was created
        expect($location.path.calls.mostRecent().args[0]).toBe('foods/' + mockFood._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/foods', sampleFoodPostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock food in scope
        scope.food = mockFood;
      });

      it('should update a valid food', inject(function (Foods) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/foods\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/foods/' + mockFood._id);
      }));

      it('should set scope.error to error response message', inject(function (Foods) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/foods\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(food)', function () {
      beforeEach(function () {
        // Create new foods array and include the food
        scope.foods = [mockFood, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/foods\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockFood);
      });

      it('should send a DELETE request with a valid foodId and remove the food from the scope', inject(function (Foods) {
        expect(scope.foods.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.food = mockFood;

        $httpBackend.expectDELETE(/api\/foods\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to foods', function () {
        expect($location.path).toHaveBeenCalledWith('foods');
      });
    });
  });
}());
