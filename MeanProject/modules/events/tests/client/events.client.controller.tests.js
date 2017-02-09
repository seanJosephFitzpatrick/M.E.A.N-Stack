'use strict';

(function () {
  // Events Controller Spec
  describe('Events Controller Tests', function () {
    // Initialize global variables
    var EventsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Events,
      mockEvent;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Events_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Events = _Events_;

      // create mock event
      mockEvent = new Events({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Event about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Events controller.
      EventsController = $controller('EventsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one event object fetched from XHR', inject(function (Events) {
      // Create a sample events array that includes the new event
      var sampleEvents = [mockEvent];

      // Set GET response
      $httpBackend.expectGET('api/events').respond(sampleEvents);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.events).toEqualData(sampleEvents);
    }));

    it('$scope.findOne() should create an array with one event object fetched from XHR using a eventId URL parameter', inject(function (Events) {
      // Set the URL parameter
      $stateParams.eventId = mockEvent._id;

      // Set GET response
      $httpBackend.expectGET(/api\/events\/([0-9a-fA-F]{24})$/).respond(mockEvent);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.event).toEqualData(mockEvent);
    }));

    describe('$scope.craete()', function () {
      var sampleEventPostData;

      beforeEach(function () {
        // Create a sample event object
        sampleEventPostData = new Events({
          title: 'An Event about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Event about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Events) {
        // Set POST response
        $httpBackend.expectPOST('api/events', sampleEventPostData).respond(mockEvent);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the event was created
        expect($location.path.calls.mostRecent().args[0]).toBe('events/' + mockEvent._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/events', sampleEventPostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock event in scope
        scope.event = mockEvent;
      });

      it('should update a valid event', inject(function (Events) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/events\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/events/' + mockEvent._id);
      }));

      it('should set scope.error to error response message', inject(function (Events) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/events\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(event)', function () {
      beforeEach(function () {
        // Create new events array and include the event
        scope.events = [mockEvent, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/events\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockEvent);
      });

      it('should send a DELETE request with a valid eventId and remove the event from the scope', inject(function (Events) {
        expect(scope.events.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.event = mockEvent;

        $httpBackend.expectDELETE(/api\/events\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to events', function () {
        expect($location.path).toHaveBeenCalledWith('events');
      });
    });
  });
}());
