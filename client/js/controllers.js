'use strict';

angular.module('myApp.controllers', [])
    .controller('MainCtrl', ['$scope', '$rootScope', 'toaster', '$window', '$filter', '$location', '$http', 'dataFactory',
        function ($scope, $rootScope, toaster, $window, $filter, $location, $http, dataFactory) {
            $scope.slide = '';
            $rootScope.back = function() {
                $scope.slide = 'slide-right';
                $window.history.back();
            };

            $rootScope.go = function(path){
                $scope.slide = 'slide-left';
                $location.url(path);
            };

            $rootScope.defaultLat = 45.560193;
            $rootScope.defaultLng = 8.049105;


            //===================
            $rootScope.reloadPage = function(){
                $window.location.reload();
            };
        }])
//=======================================================================================================
//=======================================================================================================
//=======================================================================================================
//===============================================================================
    .controller('EssMapCtrl', ['$scope', '$rootScope', '$window', '$routeParams', 'dataFactory', 'toaster', 'leafletData',
        function ($scope, $rootScope, $window, $routeParams, dataFactory, toaster, leafletData) {
            angular.extend($scope, {
                center:{
                    lat: Number($scope.defaultLat),
                    lng: Number($scope.defaultLng),
                    zoom: 13
                },
                events: {
                    map: {
                        enable: ['zoomstart', 'drag', 'click', 'mousemove'],
                        logic: 'emit'
                    }
                },
                layers: {
                    baselayers: {
                        xyz: {
                            name: 'OpenStreetMap',
                            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            type: 'xyz'
                        }
                    }
                },
                paths:{
                    p1: {
                        color: '#008000',
                        weight: 2,
                        latlngs: [
                            { lat: 45.560193, lng: 8.049105 },
                            { lat: 45.564775, lng: 8.049105 },
                            { lat: 45.564775, lng: 8.062656 },
                            { lat: 45.560193, lng: 8.062656 },
                            { lat: 45.560193, lng: 8.049105 }
                        ]
                    }
                },
                defaults: {
                    scrollWheelZoom: true
                }
            });

            $scope.$on('leafletDirectiveMarker.dragend', function(event){
                $scope.ess.lat = $scope.markers[0].lat;
                $scope.ess.lng = $scope.markers[0].lng;
            });
//=======================================================================================================
//=======================================================================================================
            $scope.$on("leafletDirectiveMarker.click", function(event, args){
                var leafEvent = args.leafletEvent;
                $scope.markers.push({
                    lat: leafEvent.latlng.lat,
                    lng: leafEvent.latlng.lng,
                    draggable: true
                });
            });
//=======================================================================================================
//=======================================================================================================
            $scope.addMarkers = function(allMarkers, position) {
                $scope.center= {
                    lat: Number(position.lat),
                    lng: Number(position.lng),
                    zoom: 12
                },
                $scope.markers= allMarkers,
                $scope.defaults= {
                    maxZoom: 18,
                    path: {
                         weight: 10,
                         color: '#8C92AC',
                         opacity: 1
                    }
                };
            };
//=======================================================================================================
//=======================================================================================================
            $scope.addPolygon = function(polygonData){
                    $scope.baselayers= {
                        name: 'OpenStreetMap (XYZ)',
                        url:  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    };
                    $scope.overlays = polygonData;
                $scope.layers={
                    baselayers: baselayers,
                    overlays: overlays
                }
            };

//=======================================================================================================
//=======================================================================================================
            $scope.getMaxLat = function(array){
                var len = array.length, max = -Infinity;
                while (len--) {
                    if (Number(array[len][0]) > max) {
                        max = Number(array[len][0]);
                    }
                }
                return max;
            };

            $scope.getMaxLong = function(array){
                var len = array.length, max = -Infinity;
                while (len--) {
                    if (Number(array[len][1]) > max) {
                        max = Number(array[len][1]);
                    }
                }
                return max;
            };

            $scope.getMinLat = function(array){
                var len = array.length, min = Infinity;
                while (len--) {
                    if (Number(array[len][0]) < min) {
                        min = Number(array[len][0]);
                    }
                }
                return min;
            };

            $scope.getMinLong = function(array){
                var len = array.length, min = Infinity;
                while (len--) {
                    if (Number(array[len][1]) < min) {
                        min = Number(array[len][1]);
                    }
                }
                return min;
            };

            $scope.bbox = {};
            $scope.showBoxList = false;
            $scope.showCommandBox = false;

            /**
             * This function use the turfjs lib to perform square grid on a certain bounding box
             * @param callback: returns all the square cells
             */
            $scope.performGridOnBox = function(callback){
                $scope.showBoxList = true;

                /**
                 * the four corners of the bounding box and cell depth of the square
                 */
                var bbox = [Number($scope.bbox.south), Number($scope.bbox.west), Number($scope.bbox.north), Number($scope.bbox.east)];
                var cellSize = Number($scope.bbox.cellDepth);
                var units = 'kilometers';


                //Takes a bbox and returns an equivalent polygon
                var poly = turf.bboxPolygon(bbox);
               // $scope.addPolygon(poly);

                console.log("the poly= "+JSON.stringify(poly));

                var squareGrid = turf.squareGrid(bbox, cellSize, units);
                var i=0;
                var allSquares = [];

                squareGrid.features.forEach(function (feature) {
                    allSquares.push({name: i, value:feature.geometry.coordinates[0]});
                    i++;
                });
                callback(allSquares);
            };

            $scope.allBboxArray = [];
            $rootScope.markerData =[];
            $scope.getAllSquareGrids = function(){
                $scope.squareGrids=[];
                var zero=0;
                var one =1;
                $rootScope.markerData=[];
                var redMarker = L.AwesomeMarkers.icon({
                    icon: 'coffee',
                    markerColor: 'red'
                });
                $scope.performGridOnBox(function(squareGrids){
                        $scope.squareGrids = squareGrids;
                        if($scope.squareGrids != null){
                            $scope.markerToSave =[];
                            $scope.allBboxArray = [];
                            for(var i=0; i<$scope.squareGrids.length; i++){
                                for(var j=0;j<$scope.squareGrids[0].value.length; j++){
                                    $rootScope.markerData.push({
                                        lat: Number($scope.squareGrids[i].value[j][zero]),
                                        lng: Number($scope.squareGrids[i].value[j][one]),
                                        message: Number($scope.squareGrids[i].value[j][zero])+'and'+Number($scope.squareGrids[i].value[j][one]),
                                        icon: redMarker
                                    });
                                    $scope.markerToSave.push({
                                        lat: Number($scope.squareGrids[i].value[j][zero]),
                                        lng: Number($scope.squareGrids[i].value[j][one])
                                    });
                                    var minLat = $scope.getMinLat($scope.squareGrids[i].value);
                                    var minLong = $scope.getMinLong($scope.squareGrids[i].value);
                                    var maxLat = $scope.getMaxLat($scope.squareGrids[i].value);
                                    var maxLong = $scope.getMaxLong($scope.squareGrids[i].value);

                                    var position = {
                                        lat: Number($scope.squareGrids[i].value[j][zero]),
                                        lng: Number($scope.squareGrids[i].value[j][one])
                                    };
                                    $scope.addMarkers($scope.markerData, position);
                                }
                                $scope.bboxSquares = [minLat,minLong,maxLat,maxLong];
                                $scope.allBboxArray.push({name: 'box'+i, value: $scope.bboxSquares, boxSize:$scope.squareGrids.length});
                            }
                            $scope.showGridParam = true;
                        }else{
                            console.log('Null Value occur!!!');
                        }
                });
            };

            $scope.selectedBbox={};
            var counter=0;
            /**
             * This method is to test if fetching all the data in each box my clicking only once

            $scope.fetchDataaaa = function(){
                    dataFactory.getPOIInBboxAll($scope.allBboxArray)
                        .query(function(data){
                            if(JSON.stringify(data[0].inserted)=="true"){
                                console.log('array as whole client side');
                                counter = counter+1;
                                toaster.pop('success', "Saved", "Data Successfully Fetched!");
                                $scope.showGridParam = false;
                                if(Number(counter)==Number($scope.allBboxArray.boxSize)){
                                    toaster.pop('info', "Saved", "All Data are Successfully Fetched. Proceed to Analysis!");
                                    $scope.showCommandBox = true;
                                }
                            }else{
                                toaster.pop('warning', "Success", "Error happen!");
                            }
                        });
            };
             */

            $scope.fetchData = function(){
                dataFactory.getPOIInBbox(
                    Number($scope.selectedBbox.allBboxArray.value[0]),
                    Number($scope.selectedBbox.allBboxArray.value[1]),
                    Number($scope.selectedBbox.allBboxArray.value[2]),
                    Number($scope.selectedBbox.allBboxArray.value[3]),
                    $scope.selectedBbox.allBboxArray.name,
                    Number($scope.selectedBbox.allBboxArray.boxSize))
                    .query(function(data){
                        if(JSON.stringify(data[0].inserted)=="true"){
                            counter = counter+1;
                            toaster.pop('success', "Saved", "Data Successfully Fetched!");
                            $scope.showGridParam = false;
                            if(Number(counter)==Number($scope.selectedBbox.allBboxArray.boxSize)){
                                toaster.pop('info', "Saved", "All Data are Successfully Fetched. Proceed to Analysis!");
                                $scope.showCommandBox = true;
                            }
                        }else{
                            toaster.pop('warning', "Success", "Error happen!");
                        }
                    });
            };

            $scope.showTable = false;
            $scope.showGridParam = true;

            $scope.prepareAnalysisData = function(){
                dataFactory.getPrepareAnalyseData()
                    .query(function(processedData){
                        if(processedData[0].value == 'success'){
                            toaster.pop('success', "Saved", "Data Successfully Analysed!");
                        }
                    });
            };

            $scope.analyseData = function(){
                dataFactory.getAnalyseData()
                    .query(function(processedData){
                        if(processedData != null){
                            setTimeout($scope.getProcessedData(),3000);
                        }
                    });
            };

            $scope.showNewBtn=false;
            var summeryData = [];

            $scope.getProcessedData = function(){
                dataFactory.getProcessedData()
                    .query(function(processedData){
                        if(processedData.length > 0){
                            $scope.showTable = true;
                            $scope.processedData = processedData;
                            summeryData = processedData;
                            $scope.showNewBtn=true;
                        }
                    });
            };

            $scope.getProcessedData();

            $scope.plotGraph = function(){
                $scope.data=[];
                var len = summeryData.length;
                var i;
                var xval = ['(Entertainment)','(Education)','(Finance)','(Religion)','(Tourism)','(Shop)','(Sport)'];
                var boxId;
                for(i=0; i<len; i++){
                    var yval = [$scope.processedData[i].entertainment,
                        $scope.processedData[i].education,
                        $scope.processedData[i].finance,
                        $scope.processedData[i].religion,
                        $scope.processedData[i].tourism,
                        $scope.processedData[i].shop,
                        $scope.processedData[i].sport];
                    $scope.data.push({x: xval ,y: yval, name: $scope.processedData[i].boxId});
                }
                $scope.layout = {height: 600, width: 1000, title: 'Data Distribution Across the Boxes'};
                $scope.options = {showLink: false, displayLogo: false};
            };

            $scope.exportData = function () {
                var blob = new Blob([document.getElementById('exportable').innerHTML], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                });
                saveAs(blob, "SummeryData.xls");
            };

            $scope.cleanAllData = function(){
                dataFactory.cleanDatabase()
                    .query(function(result){
                        if(result[0].value == 'succ'){
                            $scope.showNewBtn=false;
                            $scope.showTable = false;
                            $scope.showGridParam = true;
                            $scope.showBoxList = false;
                            $scope.showCommandBox = false;
                            toaster.pop('success', "Saved", "Database Successfully Cleaned!");
                            $scope.reloadPage();
                        }
                    });
            };
        }]);
