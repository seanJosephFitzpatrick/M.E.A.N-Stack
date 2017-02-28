'use strict';

(function () {
  // Clubs Controller Spec
  describe('Clubs Controller Tests', function () {
    // Initialize global variables
    var ClubsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Clubs,
      mockClub;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Clubs_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Clubs = _Clubs_;

      // create mock club
      mockClub = new Clubs({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Club about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Clubs controller.
      ClubsController = $controller('ClubsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one club object fetched from XHR', inject(function (Clubs) {
      // Create a sample clubs array that includes the new club
      var sampleClubs = [mockClub];

      // Set GET response
      $httpBackend.expectGET('api/clubs').respond(sampleClubs);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.clubs).toEqualData(sampleClubs);
    }));

    it('$scope.findOne() should create an array with one club object fetched from XHR using a clubId URL parameter', inject(function (Clubs) {
      // Set the URL parameter
      $stateParams.clubId = mockClub._id;

      // Set GET response
      $httpBackend.expectGET(/api\/clubs\/([0-9a-fA-F]{24})$/).respond(mockClub);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.club).toEqualData(mockClub);
    }));

    describe('$scope.craete()', function () {
      var sampleClubPostData;

      beforeEach(function () {
        // Create a sample club object
        sampleClubPostData = new Clubs({
          title: 'An Club about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Club about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Clubs) {
        // Set POST response
        $httpBackend.expectPOST('api/clubs', sampleClubPostData).respond(mockClub);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the club was created
        expect($location.path.calls.mostRecent().args[0]).toBe('clubs/' + mockClub._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/clubs', sampleClubPostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock club in scope
        scope.club = mockClub;
      });

      it('should update a valid club', inject(function (Clubs) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/clubs\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/clubs/' + mockClub._id);
      }));

      it('should set scope.error to error response message', inject(function (Clubs) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/clubs\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(club)', function () {
      beforeEach(function () {
        // Create new clubs array and include the club
        scope.clubs = [mockClub, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/clubs\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockClub);
      });

      it('should send a DELETE request with a valid clubId and remove the club from the scope', inject(function (Clubs) {
        expect(scope.clubs.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.club = mockClub;

        $httpBackend.expectDELETE(/api\/clubs\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to clubs', function () {
        expect($location.path).toHaveBeenCalledWith('clubs');
      });
    });
  });
}());
