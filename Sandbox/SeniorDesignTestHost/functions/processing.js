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
function deleteData(dbCred){
   var coll = dbCred.collection('dummies')
   console.log(coll);
   return 0;
}

// the start of the automated data load function. Contacts phishtank and reqests it's data to be loaded into the cloud firestore
// currently traverses to the .json data and requests it. taking that object it is loaded into the cloud firestore
// dbCred = the credentials of the cloud firestore. Currently this function is called from index.js of the node and passed the admin.firestore() credentials

function massDataLoad(dbCred){
    /*
    console.log("DB ADD");
    console.log(dbCred);
    var coll = dbCred.collection("dummies")
    for (i =0; i < 10; i++) {
        var URLName = "URL" + String(i);
        coll.doc(URLName).set({
            name: URLName,
            id: i,
        });
    }
    return 0;
    */
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
                // Each element in the data array is an entry of the phish tank DB
                newLocationReq.onload = function () {
                    console.log("New Request Sent & Recieved");

                    var coll = dbCred.collection("dummies")
                    
                    //console.log(newLocationReq);
                    var data = JSON.parse(newLocationReq.responseText);
                    for (i = 0; i<10; i++){
                        var curURL = data[i].url;
                        console.log(curURL);
                        coll.doc(curURL).set({
                            url: curURL
                        })
                    }
                    // console.log(data[0]);
                    
                }
                newLocationReq.send(null);
           //var headers = phsihTankReq.getResponseHeaders();
           //console.log(headers);

       }; 
    }

   phishTankReq.send(null);
   //return phishTankReq;
}
module.exports = {test,test2, massDataLoad, deleteData};