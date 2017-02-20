/**
 * Created by meknock on 1/18/2017.
 */
'use strict';

angular.module('myApp.restServices', ['ngResource'])
    .factory('dataFactory', ['$resource',
        function ($resource) {
            var urlBase = 'http://localhost:3000/api';
            var dataFactory = {};

//=============================================================================================
//======================App User Management====================================================
//=============================================================================================

            //get all getSquareGrids
            dataFactory.getSquareGrids = function (south, west, north, east, cellDepth) {
                return $resource(urlBase + '/turf/squareGrid/all/'+south+'/'+west+'/'+north+'/'+east+'/'+cellDepth, {});
            };

            dataFactory.getPOIInBbox = function (south, west, north, east, boxId, boxSize) {
                return $resource(urlBase + '/overpass/bbox/poi/'+south+'/'+west+'/'+north+'/'+east+'/'+boxId+'/'+boxSize, {});
            };

            /*
             This method is to test if fetching all the data in each box my clicking only once
            dataFactory.getPOIInBboxAll = function (allBox) {
                return $resource(urlBase + '/overpass/bbox/poi/all/'+allBox, {});
            };**/

            dataFactory.getPrepareAnalyseData = function () {
                return $resource(urlBase + '/overpass/prepare/analyse/data', {});
            };

            //get all getAnalyseData
            dataFactory.getAnalyseData = function () {
                return $resource(urlBase + '/overpass/analyse/data', {});
            };

            //get all data of each box from mongo db collection category_in_a_box
            dataFactory.getProcessedData = function () {
                return $resource(urlBase + '/overpass/processed/data/all', {});
            };

            //delete database for new data mining
            dataFactory.cleanDatabase = function () {
                return $resource(urlBase + '/overpass/clean/database', {});
            };
            return dataFactory;
        }]);