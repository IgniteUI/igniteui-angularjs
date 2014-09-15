app.service('fakeServerService',
            ['localStorage',
    function (localStorage) {
        
        'use strict';

        var svc = {
            data: [],

            key: 'homes.data',

            serializeData: function () {
                localStorage[svc.key] = JSON.stringify(svc.data);
            },

            deserializeData: function (data) {
                svc.data = JSON.parse(data);
            },

            init: function () {

                var data = localStorage[svc.key];

                var generateSeedData = function () {
                    
                    var getRandomNumber = function (min, max) {
                        return parseInt(Math.random() * (max - min) + min);
                    };

                    var addresses = [
                        "3020 Allen Avenue",
                        "127 Brockton Street",
                        "90219 The Standard Court",
                        "1897 Manzanares Drive",
                        "2000 Linden Avenue",
                        "45 Wall Parkway",
                        "3489 Peachtree Lane",
                        "872 Hopkins Drive",
                        "3929 Mayhew Canyon Road",
                        "4545 Sugarplum Trail",
                        "6789 Flower Avenue",
                        "122 Layton Street",
                        "9032 Clay Pigeon Court",
                        "383 Charles James Drive",
                        "1009 Tyler Avenue",
                        "24422 Raven Parkway",
                        "1010 Mojeska Lane",
                        "1501 Brae Burn Drive",
                        "2417 Country Club Road",
                        "745 East Traveler Trail"
                    ];

                    var notes = [
                        "On a safe cul-de-cac with pleasant neighbors",
                        "Has a jacuzzi!",
                        "Very nice yard",
                        "Huge lot",
                        "Next to great schools and a bike trail",
                        "Freeway accessible",
                        "Three car garage",
                        "Close-knit block",
                        "Swimming pool with a diving board",
                        "Includes furniture and appliances",
                        "Close to local grocery store",
                        "Active home owner's association",
                        "Lots of kids on the block",
                        "Amazing view",
                        "Circle driveway",
                        "On the top of the hill",
                        "Around the corner from the school",
                        "Rock-themed landscape",
                        "Near the freeway",
                        "Beautiful stained glass windows"
                    ];
                    
                    var cities = [
                        'Mayberry',
                        'Anytown',
                        'Riverdale'
                    ];
                    
                    var zipCodes = [
                        90210,
                        80525,
                        45693
                    ];

                    var 
                        counter = 0,
                        homes = [];
                    
                    for (var i = 0; i < 20; i++) {
                        
                        counter++;

                        if (counter > 3) {
                            counter = 1;
                        }

                        homes[homes.length] = {
                            streetAddress: addresses[i],
                            city: cities[counter-1],
                            zipCode: zipCodes[counter-1],
                            imageName: counter + '.jpg',
                            price: getRandomNumber(220000, 345000),
                            bedrooms: getRandomNumber(3, 4),
                            bathrooms: getRandomNumber(2, 3),
                            squareFeet: getRandomNumber(1500, 2400),
                            notes: notes[i],
                            id: Math.uuidCompact()
                        };
                    }

                    return homes;
                };

                if (data != undefined) {
                    svc.deserializeData(data);
                }

                if (svc.data.length === 0) {
                    svc.data = generateSeedData();
                    svc.serializeData();
                }
            },

            insert: function (home) {

                if (typeof home != 'object') throw new Error('A home object is required to do an insert.');

                home.id = Math.uuidCompact();
                svc.data.unshift(home);
                svc.serializeData();
            },

            update: function (home) {
                
                if (typeof home != 'object') throw new Error('A home object is required to do an update.');

                var 
                    len = svc.data.length,
                    index = 0;

                while (len--) {
                    
                    index = len - 1;
                    
                    if (svc.data[index] && svc.data[index].id === home.id) {
                        svc.data[index] = home;
                    }
                }

                svc.serializeData();

            },

            getById: function (id) {
                
                var returnValue = {};

                svc.data.forEach(function (home) {
                    if (home.id === id) {
                        returnValue = home;
                    }
                });

                return returnValue;
            },

            'delete': function (id) {
                
                var lengthOfUUID = 36;
                
                if (id.length != lengthOfUUID) throw new Error('A valid UUID value is required as an ID.');

                var 
                    len = svc.data.length,
                    index = 0;

                while (len--) {
                    
                    index = len - 1;
                    
                    if (svc.data[index] && svc.data[index].id === id) {
                        svc.data.splice(index, 1);
                    }
                }

                svc.serializeData();
            }
        };

        svc.init();

        return {
            data: svc.data,
            insert: svc.insert,
            'delete': svc.delete,
            update: svc.update,
            getById: svc.getById
        };

    }]);

app.config(['$provide',
    function ($provide) {
        $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
    }]);

app.run(
            ['$httpBackend', 'fakeServerService',
    function ($httpBackend, fakeServerService) {
        
        var apiRegex = /\/api\/homes\//;

        $httpBackend.whenGET('/api/homes').respond(fakeServerService.data);

        $httpBackend.whenPOST('/api/homes').respond(function (method, uri, data) {
            var home = angular.fromJson(data);

            if (home.id === null) {
                fakeServerService.insert(home);
            } else {
                fakeServerService.update(home);
            }
            return [200, { success: true }];
        });

        $httpBackend.whenDELETE(apiRegex).respond(function (method, uri, data) {
            var parts = uri.split('/');
            var id = parts[parts.length - 1];
            fakeServerService.delete(id);
            return [200, { success: true }];
        });

        $httpBackend.whenGET(apiRegex).respond(function (method, uri, data) {
            var parts = uri.split('/');
            var id = parts[parts.length - 1];

            var home = fakeServerService.getById(id);
            return [200, home];
        });

    }]);