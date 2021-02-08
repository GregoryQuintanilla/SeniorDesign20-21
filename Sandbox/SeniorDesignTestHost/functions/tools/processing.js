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
   // We are encountering promises!
   // for a solid youtube video about them from google specifically:
   // https://www.youtube.com/watch?v=7IkUgCLr5oA
   //
   // essentially Promises are an object that says some async work is being done in the backgroud. they have 3 states:
   // Pending - the work is currently being done
   // fullfilled - the work has completed
   // rejected - the work was unable to finish
   // all function that return promises return them immediately, most likely in the pending state and we need to use that same promise
   // object to wait for it to be fullfilled. 
   // Most of them have some .then that can be made to handle when the promise if finished.
   var coll = dbCred.collection('test1').get(); // gets a snapshot of the collection

   // accessing each of the docs
   coll.then(query =>{
       var documents = query.docs

       documents.forEach(doc => {
           console.log(doc.id);
           console.log(doc.data());
       });
       return 0;
   });


   /*
   if(mydoc){
       console.log("Found a doc?");
       console.log(mydoc);
       console.log(mydoc.id);
       // some async work ad process of getting the data from a document.
       var docData = mydoc.get();
       docData.then(snapshot => {
           console.log(snapshot);
           console.log(snapshot.data())
           return 0;
       })
   }
   else{
       console.log("didint find the doc");
   }
   */
   return 0;
}

// the start of the automated data load function. Contacts phishtank and reqests it's data to be loaded into the cloud firestore
// currently traverses to the .json data and requests it. taking that object it is loaded into the cloud firestore
// dbCred = the credentials of the cloud firestore. Currently this function is called from index.js of the node and passed the admin.firestore() credentials

function massDataLoad(dbCred){
   console.log("Loadphish tank database...");
   
   var phishTankReq = new XMLHttpRequest();
   phishTankReq.open("GET","https://data.phishtank.com/data/online-valid.json", false);
   phishTankReq.onload = function (){
           if(phishTankReq.status == 302){
                //Acquire the temporary location of the requested file.
                var newLocation = phishTankReq.getResponseHeader("location");

                // Hopefully we have the correct URL for the moved address of the .json file

                var newLocationReq = new XMLHttpRequest();
                newLocationReq.open("GET",newLocation,false);
                // Each element in the data array is an entry of the phish tank DB
                newLocationReq.onload = function () {
                    console.log("New Request Sent & Recieved");

                    var coll = dbCred.collection("test1")
                    
                    var data = JSON.parse(newLocationReq.responseText);
                    for (i = 0; i<10; i++){
                        var curURL = data[i].url;
                        console.log(curURL);
                        coll.doc(String(i)).set({
                            url: curURL
                        })
                    }
                }
                newLocationReq.send(null);
       }; 
    }

   phishTankReq.send(null);
   //return phishTankReq;
}
module.exports = {test,test2, massDataLoad, deleteData};