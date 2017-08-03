# MapDataCrawler
is an Application to fetch data from Openstreet map by consuming the read only Overpass API. Basically using this App a user can do the following two things.  
    1. Can partition or make grid to a certain geographical area according to user provided inputs.  
    2. Fetch data describing each box (Grid) from Openstreet map using the read only Overpass API  
    3. Preprocess and store the fetched data in appropriate way  
    4. Present the result  
## Tools Used
    -bootstrap.js
    -Angular.js
    -Turf.js
    -ploty.js
    -leaflet.js
    -Node.js  
    -Overpass API  
    -query-overpass npm
    -MongoDB  
    -Mongodb npm  
      
        
### Functional Requirments
    Create Grid    
        Using this functionality of the system the user can create a square grid structure of a certain region of a map.  
        It simply implements the squareGrid API of Turf.js. The API takes a bounding box and a cell width and returns  
        a set of square polygons in a grid.
        Bounding box = [minLat, minLong, maxLat, maxLong]
    Fetch Data  
        Using this functionality of the system the user can retrieve the raw data found in each box using the OverpassAPI service  
        Dump the data in to different MongoDB collections which are dynamically created, one for each category  
        I execute four different overpass queries to bring all the data for each category
    Analyze Data  
        This functionality the system count the point of interests found in each box according to their categories   
        Put the result in a separate MongoDb collection  
    Display Summary  
        In this functionality the system collect the data found in each category collection  
        Combine them into readable format in one Mongodb collection  
        Fetch to the client side and display it on the web page in table format.    
    Plot Distribution    
        This functionality creates chart using plotlyjs which is interactive JavaScript graphing library to shows  
        the distribution of the data across the boxes.  
    Export to Excel  
        Using this functionality of the system the user is able to export the summarized data which is displayed  
        in table format on the web page in to excel using only one click.  
    Clean All Data
        The data crawler is needed to be reset when the user needs to crawl data on another geographical location  
        In this case the user can click on clean all data button to clean all the data from the database  
        and start new session on another location

## Dependencies  
  1. install Node.js version 4.2.1   
  2. install MongoDB  
  
## Getting Started  
  Go to the project directory and  
      **npm install**  
  This will install all the npm modules required for this project  
  and to run the application after you started MongoDB  
      **node server.js**  
