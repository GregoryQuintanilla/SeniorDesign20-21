/**  
 * This way I think it will be easier to organize the logic of our functions and process. index.js will be used more as the routing and interface
 * between these functions and the https calls to the server. 
 * 
 * This will begin to feel like what our "API" will look like. There are a few different forms the export can be created. I like this method 
 * better. I think it's easier this way for structure. There are some other ways I have seen that package and send ALL function written, but this
 * way we only give the NodeJS route access to the ones we want it to have.
 * 
 * The below also accomplish the goal and in the end it's semantic and oraganization. All of them complete the same goals. 
*/

/** Method to send all inside a method.
 *  var methods = {
 *      test : function(){
 *                  console.log("this is a test function")l               
 *              } 
 *      test2 : function() {
 *                  console.log("this is a SECOND test function");     
 *              } 
 *  };
 * module.exports = methods
 * 
 * OR ------
 * 
 *  var methods = {}
 *  methods.test = function(){
 *                      console.log("this is a test function");
 *                  }
 *  ...
 * 
 *  module.exports = methods
 */



// --- My Preference but it won't kill me if y'all disagree ---
// since this is being used by node we need to requrie this API tool specifially because it doesn't come with Node by default.
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

function test(){
    console.log("This is a test function from an external js file.")
}

function test2(){
    console.log("This is the SECOND functio to test how the exporting works really.");
}

function massDataLoad(){
   console.log("Loadphish tank database...");
   
   var phishTankReq = new XMLHttpRequest();
   phishTankReq.open("GET","https://data.phishtank.com/data/online-valid.json", false);
   phishTankReq.onload = function (){
           if(phishTankReq.status == 302){
                console.log("GOT A 302");
                console.log("REQUEST");
                console.log(phishTankReq);
                console.log("ENDREQUEST");
                
                //console.log(phishTankReq.responseURL);
                
                //console.log("\nHEADERS\n");
                //var headers = phishTankReq.getAllResponseHeaders();
                //console.log(headers);
                //console.log("\nENDHEADER\n");

                //Acquire the temporary location of the requested file.
                console.log("\nLOCATION\n");
                var newLocation = phishTankReq.getResponseHeader("location");
                console.log(newLocation);
                console.log("\nENDLOCATION\n"); //Have hit this line 2.1.21


                // Hopefully we have the correct URL for the moved address of the .json file
                // Code getting hung here 2.1.21
                // This request gets a lot of data back, so it takes quite some time to get and pull in.
                // This process will take some time, but good thing this is going to be an automated update piece.
                // Hopefully developer stuff has a faster way
                var newLocationReq = new XMLHttpRequest();
                newLocationReq.open("GET",newLocation,false);
                newLocationReq.onload = function () {
                    console.log("New Request Sent & Recieved");
                    //console.log(newLocationReq);
                    var data = JSON.parse(newLocationReq.responseText);
                }
                newLocationReq.send(null);
           //var headers = phsihTankReq.getResponseHeaders();
           //console.log(headers);
       };
    }

   phishTankReq.send(null);
   //return phishTankReq;
}
module.exports = {test,test2, massDataLoad};