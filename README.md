# MapDataCrawler
is an Application to fetch data from Openstreet map by consuming the read only Overpass API. Basically using this App a user can do the following things.  
    1. Can partition or make grid to a certain geographical area (a rectangle on a map) according to user provided inputs (the four corner of the rectangle and width of square box for the grid).  
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
    
## Functional Requirments
    1. Create Grid    
        Using this functionality of the system the user can create a square grid structure 
        of a certain region of a map. It simply implements the squareGrid API of Turf.js. 
        The API takes a bounding box and a cell width and returns a set of square polygons in a grid.
        Bounding box = [minLat, minLong, maxLat, maxLong]
        
        ![homepg](https://user-images.githubusercontent.com/5079828/35702924-bd6613c4-079a-11e8-87c6-71f5381ba83c.png)
        
    2. Fetch Data  
        Using this functionality of the system the user can retrieve the raw data found in each 
        box using the OverpassAPI service Dump the data in to different MongoDB collections 
        which are dynamically created, one for each category I execute four different overpass 
        queries to bring all the data for each category
    3. Analyze Data  
        This functionality the system count the point of interests found in each box according 
        to their categories Put the result in a separate MongoDb collection  
    4. Display Summary  
        In this functionality the system collect the data found in each category collection  
        Combine them into readable format in one Mongodb collection  
        Fetch to the client side and display it on the web page in table format.    
    5. Plot Distribution    
        This functionality creates chart using plotlyjs which is interactive JavaScript 
        graphing library to shows the distribution of the data across the boxes.  
    6. Export to Excel  
        Using this functionality of the system the user is able to export the summarized
        data which is displayed in table format on the web page in to excel using only one click.  
    7. Clean All Data
        The data crawler is needed to be reset when the user needs to crawl data on another 
        geographical location In this case the user can click on clean all data button to 
        clean all the data from the database and start new session on another location
        
## Dependencies  
  1. install Node.js version 4.2.1   
  2. install MongoDB  
  
## Getting Started  
  Go to the project directory and  
      **npm install**  
  This will install all the npm modules required for this project  
  and to run the application after you started MongoDB  
      **node server.js**  
  Open your browser and go to
  http://localhost:3000
