/**
 * Created by meknock on 1/18/2017.
 */
var overpass = require('query-overpass');
var mongo = require("mongodb");
var host = "127.0.0.1";
var port = 27017;

getQueryAmenity = function(south,west,north,east,boxId, callback) {
    var queryAmenity ='[out:json][timeout:50];(node["amenity"](' + south + ',' + west + ',' + north + ',' + east + ');way["amenity"](' + south + ',' + west + ',' + north + ',' + east + ');relation["amenity"](' + south + ',' + west + ',' + north + ',' + east + '););(._;>;);out;';
    var flatProperties = true;

    var db = new mongo.Db("OSM_data_mining", new mongo.Server(host, port, {}));
    db.open(function (error) {
        if (!error) {
            overpass(queryAmenity, function (error, data) {
                if (!error) {
                    var categoryInBox = {south: south,west: west,north: north,east: east,boxId: boxId, data: data};
                    var col = db.collection('amenity_in_'+boxId);
                    col.insert(categoryInBox, function (err, records) {
                        //console.log('amenity_in_=' + ' ' + JSON.stringify(records));
                    });
                    callback('success');
                }else{
                    callback('error');
                    console.log('Error fetching data at amenity!');
                }
                //res.json(data);
            }, flatProperties);
        }
    });
};

getQueryTourism = function(south,west,north,east,boxId, callback) {
    var queryTourism ='[out:json][timeout:50];(node["tourism"](' + south + ',' + west + ',' + north + ',' + east + ');way["tourism"](' + south + ',' + west + ',' + north + ',' + east + ');relation["tourism"](' + south + ',' + west + ',' + north + ',' + east + '););(._;>;);out;';
    var flatProperties = true;

    var db = new mongo.Db("OSM_data_mining", new mongo.Server(host, port, {}));
    db.open(function (error) {
        if (!error) {
            overpass(queryTourism, function (error, data) {
                if (!error) {
                    var categoryInBox = {south: south,west: west,north: north,east: east,boxId: boxId, data: data};
                    var col = db.collection('tourism_in_'+boxId);
                    col.insert(categoryInBox, function (err, records) {
                        //console.log('tourism_in_=' + ' ' + JSON.stringify(records));
                    });
                    callback('success');
                }else{
                    callback('error');
                    console.log('Error fetching data at tourism!');
                }
            }, flatProperties);
        }
    });
};

getQueryShop = function(south,west,north,east,boxId, callback) {
    var queryShop ='[out:json][timeout:50];(node["shop"](' + south + ',' + west + ',' + north + ',' + east + ');way["shop"](' + south + ',' + west + ',' + north + ',' + east + ');relation["shop"](' + south + ',' + west + ',' + north + ',' + east + '););(._;>;);out;';
    var flatProperties = true;

    var db = new mongo.Db("OSM_data_mining", new mongo.Server(host, port, {}));
    db.open(function (error) {
        if (!error) {
            overpass(queryShop, function (error, data) {
                if (!error) {
                    var categoryInBox = {south: south,west: west,north: north,east: east,boxId: boxId, data: data};
                    var col = db.collection('shop_in_'+boxId);
                    col.insert(categoryInBox, function (err, records) {
                        //console.log('shop_in_=' + ' ' + JSON.stringify(records));
                    });
                    callback('success');
                }else{
                    callback('error');
                    console.log('Error fetching data at shop!');
                }
            }, flatProperties);
        }
    });
};

getQuerySport = function(south,west,north,east,boxId, callback) {
    var querySport ='[out:json][timeout:50];(node["sport"](' + south + ',' + west + ',' + north + ',' + east + ');way["sport"](' + south + ',' + west + ',' + north + ',' + east + ');relation["sport"](' + south + ',' + west + ',' + north + ',' + east + '););(._;>;);out;';
    var flatProperties = true;

    var db = new mongo.Db("OSM_data_mining", new mongo.Server(host, port, {}));
    db.open(function (error) {
        if (!error) {
            overpass(querySport, function (error, data) {
                if (!error) {
                    var categoryInBox = {south: south,west: west,north: north,east: east,boxId: boxId, data: data};
                    var col = db.collection('sport_in_'+boxId);
                    col.insert(categoryInBox, function (err, records) {
                        //console.log('sport_in_=' + ' ' + JSON.stringify(records));
                    });
                    callback('success');
                }else{
                    callback('error');
                    console.log('Error fetching data at sport!');
                }
            }, flatProperties);
        }
    });

};

insertBoxSize = function(boxSize, callback) {
    var db = new mongo.Db("OSM_data_mining", new mongo.Server(host, port, {}));

    var boxSizeFrmted = {boxSize: boxSize};

    db.open(function (error) {
        if (!error) {
            var col = db.collection('boxSize');
            col.insert(boxSizeFrmted, function (err, records) {
                //console.log('boxSize=' + ' ' + JSON.stringify(records));
            });
            callback('success');
        }else{
            console.log('ERROR Opening Db=' + ' ' + JSON.stringify(error));
        }
    });
};

getBoxSize = function(callback) {
    var db = new mongo.Db("OSM_data_mining", new mongo.Server(host, port, {}));
    db.open(function (error) {
        if(!error){
            // Get the documents collection
            var collection = db.collection('boxSize');
            // Find some documents
            collection.find({}).toArray(function(err, boxSize) {
                if(!err){
                    callback(boxSize[0].boxSize);
                }else{
                    console.log('table empty');
                }
            });
        }else{
            console.log('Error opening DB!');
        }
    });
};

countEachCategoryInAmenity = function(index, callback) {
    var db = new mongo.Db("OSM_data_mining", new mongo.Server(host, port, {}));
    var categoryInBox = [];
    var category = 'amenity';
    db.open(function (error) {
        if(!error){
            var tblKeyWord = '_in_box';
            var counter=0;
            var entertainment=0;
            var education=0;
            var finance=0;
            var religion=0;
            var i;
            var tblName = category+tblKeyWord+index;
            // Get the documents collection
            var collection = db.collection(tblName);
            // Find some documents
            collection.find({}).toArray(function(err, data) {
                if(!err){
                    counter = data[0].data.features.length;
                    for(i=0; i<counter;i++){
                        if(data[0].data.features[i].properties.tags.amenity==('atm'||'bank'||'bureau_de_change')){
                            finance = finance+1;
                        }else if(data[0].data.features[i].properties.tags.amenity==('school'||'college'||'kindergarten'||'library'||'public_bookcase'||'music_school'||'driving_school'||'language_school'||'university')){
                            education = education+1;
                        }else if(data[0].data.features[i].properties.tags.amenity==('place_of_worship')){
                            religion = religion+1;
                        }
                        else if(data[0].data.features[i].properties.tags.amenity==('bar'||'bbq'||'biergarten'||'cafe'||'fast_food'||'food_court'||'ice_cream'||'pub'||'restaurant'||'arts_centre'||'brothel'||'casino'||'cinema'||'community_centre'||'fountain'||'gambling'||'nightclub'||'planetarium'||'social_centre'||'stripclub'||'studio'||'swingerclub'||'theatre')){
                            entertainment = entertainment+1;
                        }
                    }
                    categoryInBox = {boxId: data[0].boxId, south: data[0].south, west: data[0].west, north: data[0].north, east: data[0].east, entertainment: entertainment,religion: religion, education: education, finance: finance};
                    callback(categoryInBox);
                }else{
                    console.log('table empty');
                }
            });
        }else{
            console.log('Error opening DB!');
        }
    });
};

countDataInTableByCategory = function(category, index, callback) {
    var db = new mongo.Db("OSM_data_mining", new mongo.Server(host, port, {}));
    var categoryInBox = [];
    db.open(function (error) {
        if(!error){
            var tblKeyWord = '_in_box';
            var counter=0;
            var tblName = category+tblKeyWord+index;
            // Get the documents collection
            console.log("tableName= "+tblName);
            var collection = db.collection(tblName);
            // Find some documents
            collection.find({}).toArray(function(err, data) {
                if(!err){
                    console.log("the data== "+JSON.stringify(data));
                    counter = data[0].data.features.length;
                    categoryInBox = {boxId: data[0].boxId, south: data[0].south, west: data[0].west, north: data[0].north, east: data[0].east, category: counter};
                    callback(categoryInBox);
                }else{
                    console.log('table empty');
                }
            });
        }else{
            console.log('Error opening DB!');
        }
    });
};

countCategoryInAmenity = function(){
    getBoxSize(function(size){
        var db = new mongo.Db("OSM_data_mining", new mongo.Server(host, port, {}));
        var category = 'amenity';
        db.open(function (error) {
            if (!error) {
                var col = db.collection('box_dist_of_'+category);
                var tableIndex;
                for(tableIndex=0; tableIndex<size; tableIndex++) {
                    countEachCategoryInAmenity(tableIndex, function (groupedAmenity) {
                        col.insert(groupedAmenity, function (err, records) {
                            //console.log('countInAmenity=' + ' ' + JSON.stringify(groupedAmenity));
                        });
                    });
                }
            }
        });
    });
};

countCategory = function(category){
    getBoxSize(function(size){
        var db = new mongo.Db("OSM_data_mining", new mongo.Server(host, port, {}));
        db.open(function (error) {
            if (!error) {
                var col = db.collection('box_dist_of_'+category);
                var tableIndex;
                for(tableIndex=0; tableIndex<size; tableIndex++) {
                    countDataInTableByCategory(category, tableIndex, function (numOfShops) {
                        col.insert(numOfShops, function (err, records) {
                        });
                    });
                }
            }
        });
    });
};

getAllAmenity = function(callback) {
    var db = new mongo.Db("OSM_data_mining", new mongo.Server(host, port, {}));
    db.open(function (error) {
        if(!error){
            var tableName='box_dist_of_amenity';
            var collection = db.collection(tableName);
            // Find some documents
            collection.find({}).toArray(function(err, allAmenity) {
                if(!err){
                    callback(allAmenity);
                }else{
                    console.log('access table error');
                }
            });
        }else{
            console.log('Error Database cant open');
        }
    });
};

getAllDataByCategory = function(category, callback) {
    var db = new mongo.Db("OSM_data_mining", new mongo.Server(host, port, {}));
    db.open(function (error) {
        if(!error){
            var regions =[];
            // Get the documents collection
            var collection = db.collection('box_dist_of_'+category);
            // Find some documents
            collection.find({}).toArray(function(err, allCategory) {
                if(!err){
                    callback(allCategory);
                }else{
                    console.log('access table error');
                }
            });
        }else{
            console.log('Error Database cant open');
        }
    });
};

combineCategory = function(callback) {
    var db = new mongo.Db("OSM_data_mining", new mongo.Server(host, port, {}));
    db.open(function (error) {
        if(!error){
            var shops=[];
            var sport=[];
            var tourism=[];
            getAllDataByCategory('shop', function(allShopes){
                shops=allShopes;
            });
            getAllDataByCategory('sport', function(allSport){
                sport=allSport;
            });
            getAllDataByCategory('tourism', function(allTourism){
                tourism=allTourism;
            });
            var combinedData=[];
            getAllAmenity(function(amenity){
               for(var i=0; i<amenity.length; i++){
                   amenity[i].shop = shops[i].category;
                   amenity[i].sport = sport[i].category;
                   amenity[i].tourism = tourism[i].category;
               }
                combinedData=amenity;
                //console.log('combine=' + ' ' + JSON.stringify(combinedData));
                var col = db.collection('category_in_box');
                col.insert(combinedData, function (err, records) {
                    callback(records);
                });
            });
        }else{
            console.log('Error Database cant open');
        }
    });
};

exports.getProcessedData = function(req, res) {
    var db = new mongo.Db("OSM_data_mining", new mongo.Server(host, port, {}));
    db.open(function (error) {
        if(!error){
            var tableName='category_in_box';
            var collection = db.collection(tableName);
            // Find some documents
            collection.find({}).toArray(function(err, processedData) {
                if(!err){
                    res.json(processedData);
                }else{
                    console.log('access table error');
                }
            });
        }else{
            console.log('Error Database cant open');
        }
    });
};

exports.prepareAnalyseData = function(req,res){
    var succ = [];
    setTimeout(function(){
        countCategory('tourism')
    }, 2000);

    setTimeout(function(){
        countCategory('shop')
    }, 2000);

    setTimeout(function(){
        countCategory('sport')
    }, 2000);

    countCategoryInAmenity();
    succ.push({value: "success"});
    res.json(succ);
};

exports.analyseData = function(req,res){
    var summData = [];
    combineCategory(function(data){
        summData.push({value: "succ"});
        res.json(summData);
    });
};


/**
 * This method is to test if fetching all the data in each box my clicking only once
 *
pointOfInterestInAllBbox = function(req, res) {
    var allBoxArray = req.params.allBox;
    console.log('array as whole= '+JSON.stringify(allBoxArray));
    //var allBoxArray=[{"name":"box0","value":[43.7054,10.3803,43.72367996698315,10.398280787545295],"boxSize":6},{"name":"box1","value":[43.7054,10.398280787545295,43.72367996698315,10.416261575090589],"boxSize":6},{"name":"box2","value":[43.7054,10.416261575090589,43.72367996698315,10.434242362635883],"boxSize":6},{"name":"box3","value":[43.72367996698315,10.3803,43.7419599339663,10.398280787545295],"boxSize":6},{"name":"box4","value":[43.72367996698315,10.398280787545295,43.7419599339663,10.416261575090589],"boxSize":6},{"name":"box5","value":[43.72367996698315,10.416261575090589,43.7419599339663,10.434242362635883],"boxSize":6}];
    var e;
    for(e=0;e<allBoxArray[0].boxSize;e++){
        (function(i) {
        insertBoxSize(allBoxArray[0].boxSize, function(inserted){
            console.log('inserted!');
            getQueryAmenity(allBoxArray[i].value[0],allBoxArray[i].value[1],allBoxArray[i].value[2],allBoxArray[i].value[3],allBoxArray[i].name, function(inserted){
                if(inserted=='success'){
                    setTimeout(getQueryTourism(allBoxArray[i].value[0],allBoxArray[i].value[1],allBoxArray[i].value[2],allBoxArray[i].value[3],allBoxArray[i].name, function(inserted){
                        if(inserted=='success'){
                            setTimeout(getQueryShop(allBoxArray[i].value[0],allBoxArray[i].value[1],allBoxArray[i].value[2],allBoxArray[i].value[3],allBoxArray[i].name, function(inserted){
                                if(inserted=='success'){
                                    setTimeout(getQuerySport(allBoxArray[i].value[0],allBoxArray[i].value[1],allBoxArray[i].value[2],allBoxArray[i].value[3],allBoxArray[i].name, function(inserted){
                                        if(inserted=='success'){
                                           // setTimeout(getQueryTourism(allBoxArray[i].value[0],allBoxArray[i].value[1],allBoxArray[i].value[2],allBoxArray[i].value[3],allBoxArray[i].name, function(inserted){
                                                if(inserted=='success'){
                                                    res.json([{inserted: true}]);
                                                }
                                            //}), 3000);
                                        }
                                    }), 3000);
                                }
                            }), 3000);
                        }
                    }), 3000);
                }
            });
        });
        })(e);
    }
};
//pointOfInterestInAllBbox();
**/
/**
exports.pointOfInterestInBbox = function(req, res) {
    var south = req.params.south;
    var west = req.params.west;
    var north = req.params.north;
    var east = req.params.east;
    var boxId = req.params.boxId;
    var boxSize = req.params.boxSize;
    insertBoxSize(boxSize, function(inserted){
        console.log('inserted!');
        getQueryAmenity(south,west,north,east,boxId, function(inserted){
            if(inserted=='success'){
                setTimeout(getQueryTourism(south,west,north,east,boxId, function(inserted){
                    if(inserted=='success'){
                        setTimeout(getQueryShop(south,west,north,east,boxId, function(inserted){
                            if(inserted=='success'){
                                setTimeout(getQuerySport(south,west,north,east,boxId, function(inserted){
                                    if(inserted=='success'){
                                        setTimeout(getQueryTourism(south,west,north,east,boxId, function(inserted){
                                            if(inserted=='success'){
                                                res.json([{inserted: true}]);
                                            }
                                        }), 3000);
                                    }
                                }), 3000);
                            }
                        }), 3000);
                    }
                }), 3000);
            }
        });
    });
};**/


exports.pointOfInterestInBbox = function(req, res) {
    var south = req.params.south;
    var west = req.params.west;
    var north = req.params.north;
    var east = req.params.east;
    var boxId = req.params.boxId;
    var boxSize = req.params.boxSize;
    insertBoxSize(boxSize, function(inserted){
        console.log('inserted!');
        getQueryAmenity(south,west,north,east,boxId, function(inserted){
            if(inserted=='success'){
                //console.log("query amenity is called");
                //res.json([{inserted: true}]);

                getQueryTourism(south,west,north,east,boxId, function(inserted){
                    if(inserted=='success'){
                        getQueryShop(south,west,north,east,boxId, function(inserted){
                            if(inserted=='success'){
                               getQuerySport(south,west,north,east,boxId, function(inserted){
                                    if(inserted=='success'){
                                        getQueryTourism(south,west,north,east,boxId, function(inserted){
                                            if(inserted=='success'){
                                                res.json([{inserted: true}]);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });


                /**setTimeout(getQueryTourism(south,west,north,east,boxId, function(inserted){
                    if(inserted=='success'){
                        setTimeout(getQueryShop(south,west,north,east,boxId, function(inserted){
                            if(inserted=='success'){
                                setTimeout(getQuerySport(south,west,north,east,boxId, function(inserted){
                                    if(inserted=='success'){
                                        setTimeout(getQueryTourism(south,west,north,east,boxId, function(inserted){
                                            if(inserted=='success'){
                                                res.json([{inserted: true}]);
                                            }
                                        }), 3000);
                                    }
                                }), 3000);
                            }
                        }), 3000);
                    }
                }), 3000);**/
            }
        });
    });
};

exports.cleanDatabase = function(req, res){
    var db = new mongo.Db("OSM_data_mining", new mongo.Server(host, port, {}));
    var succ=[];

    db.open(function (error) {
        if (!error) {
            db.dropDatabase(function(err, result) {
                if(!err){
                    succ.push({value: "succ"});
                    res.json(succ);
                }
            });
        }else{
            console.log('Error Database cant open');
        }
    });
};