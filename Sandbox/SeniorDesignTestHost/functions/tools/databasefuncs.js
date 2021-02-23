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

// Deletes a data entry by url
// dbCred - admin.firestore() object - the object to the firestore you wan tot access
// URL - string - is the desired URL to be found and removed. 
// returns nothing to the browser.
function deleteData(dbCred, URL){
   // How do we want to go about how we will delete data?
   // When will we delete data?
   // Who triggers these deletions? Server most likely.
   // Any manual deletions?
   // We can do by url/ID

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

   if(typeof(URL) != "string"){
       return 0;
   }

   var search = searchURL(dbCred,URL);

   search.then(answer =>{
       console.log(answer);
       if(answer != -1){
           var coll = dbCred.collection('test1').doc(answer) //.delete(); // gets a snapshot of the collection
           console.log(coll);
       }
   })
   // TODO Check if valid firestore reference is passed

   // accessing each of the docs
   // no signal needs to be sent back to the extension of a successful deletion, this is all our own info
   
   /* 
   coll.then(query =>{
       var documents = query.docs

       for(i =0; i < documents.length; i++){
           var doc = documents[i];
           console.log(doc.id);

           if(doc.data().url == URL){
               return 1;
           }

       }
       return 0;
   });
   */
   


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
   return 1;
}
//TODO
// a few different type of search functions for different systems. By URL will probably be the first one because of the nature
// of the extenstion
function searchURL(dbCred, curURL){
    if(typeof(curURL) != "string"){
        return 0;
    }

    // TODO - param check on dbCred


    // encountering lots of promises wonky-ness
    // return the id??
    var URLCollection_promise = dbCred.collection("test1").get();
    var result = URLCollection_promise.then(query => {
        var documents = query.docs;
        var match = 0;
        for(i = 0; i < documents.length; i++){
            console.log(documents[i].id);
            console.log(documents[i].data().url)
            if(documents[i].data().url == curURL){
                return documents[i].id;
            }
        }
        /*
        documents.forEach(doc => {
            if(doc.data().url == curURL){
               match = 1
            }
        });
        */
        return -1;
    });
    console.log(result);
    return result;
    
}
// function searchByID{}

// the start of the automated data load function. Contacts phishtank and reqests it's data to be loaded into the cloud firestore
// currently traverses to the .json data and requests it. taking that object it is loaded into the cloud firestore
// dbCred = the credentials of the cloud firestore. Currently this function is called from index.js of the node and passed the admin.firestore() credentials
function addToDB(dbCred, malURL){
    if(typeof(malURL) != "string"){
        return 0;
    }

    // TODO param check on dbcred

    var urlCollection = dbCred.collection("test1") // update collection name once the depoy DB is determined
    
    urlCollection.doc().set({
        url: malURL
    })
}
function massDataLoad(dbCred){
   // Is ready, just adjust the for loop to do all data.
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
                    var coll = dbCred.collection("test1");
                    var data = JSON.parse(newLocationReq.responseText);
                    for (i = 0; i<3; i++){
                        /**
                         * So ran into an issue. firestore ID's can't have / (forward slashses) in them so the url id is out
                         * because replacing them is 1) extra formatting and overhead on our part. 2) no way to guarentee that our
                         * new process is 100%. Whatever character we replace it with or whatever can still show up normally and then
                         * break the url.
                         * 
                         * Maybe just split it into an arry on / chars? but still run into overhead and this may come around to bite
                         * us in the ass for the timing issues.
                         * 
                         * Mainting our own indexing may have to be the solution. It may have the least search performance impacts.
                         */
                        // leaving .doc() blank has firestore auto-generate the ids
                            // easy and automated
                            // will degrade search performance
                        // we could pull id #'s from phishtank and follow their conventions
                            // easy enough to grab on loads and updates
                            // if phishtank ever mass changes id numbers, this may casue issues for our tracking
                        // we could track our own id #'s
                            // again will cause search degredation
                            // our own system though and will require a bit more management.
                        
                        coll.doc(i).set({
                            url: curURL,
                        });
                    }
                }
                newLocationReq.send(null);
       }; 
    }

   phishTankReq.send(null);
   //return phishTankReq;
}
function massDataUpdate(dbCred){
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
                    var coll = dbCred.collection("test1");
                    var data = JSON.parse(newLocationReq.responseText);
                    for (i = 0; i<3; i++){
                        coll.doc(i).set({
                            url: curURL,
                        }) 
                    }
                }
                newLocationReq.send(null);
       }; 
    }

   phishTankReq.send(null);
   //return phishTankReq;
}
// TODO
// The framework for the automated update function. This will be very simialr to the Load function above
// and the only differences will be when triggered, how it's triggered, and the comparison piece to update entries
// ----- MAY NEED A TESTING FUNCTION TO DOUBLE CHECK DATA WAS LOADED CORRECTLY ----- //
//function massDataUpdate(dbCred){}
module.exports = {massDataLoad, deleteData, addToDB, searchURL};