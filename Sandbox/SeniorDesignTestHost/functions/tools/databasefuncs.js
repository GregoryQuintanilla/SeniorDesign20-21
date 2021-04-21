// since this is being used by node we need to requrie this API tool specifially because it doesn't come with Node by default.
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

/** Deletes a data entry by url
 * dbCred - admin.firestore() object - the object to the firestore you wan tot access
 * URL - string - is the desired URL to be found and removed. 
 * returns nothing to the browser.
 */
function deleteData(dbCred, URL){
   // How do we want to go about how we will delete data?
   // When will we delete data?
   // Who triggers these deletions? Server most likely.
   // Any manual deletions?
   // We can do by url/ID

   if(typeof(URL) != "string"){
       return 0;
   }

   var search = searchURL(dbCred,URL);

   search.then(answer =>{
       console.log("Id of URL to delete " + String(answer));
       if(answer != -1){
           dbCred.collection('test1').doc(answer).delete(); // gets a snapshot of the collection
       }
   }).catch(err => {
       console.log(err);
       console.log("An Error Occured");
   });
   // TODO Check if valid firestore reference is passed
   return 1;
}

//TODO
// a few different type of search functions for different systems. By URL will probably be the first one because of the nature
// of the extenstion

// MAY ADJUST THIS CODE SO WE HAVE A BASE DB SEARCH FUNCTION then make searchURL just a specific call of search.
// We could then also reuse the same function for admin stuff.
function searchURL(dbCred, curURL){
    if(typeof(curURL) != "string"){
        return -1;
    }

    // TODO - param check on dbCred


    // encountering lots of promises wonky-ness
    // return the id??
    var URLCollection_promise = dbCred.collection("MaliciousSites").get();
    var result = URLCollection_promise.then(query => {
        var documents = query.docs;

        for(i = 0; i < documents.length; i++){
            if(documents[i].data().url == curURL){
                return documents[i].id;
            }
        }
        return -1;
    }).catch(err =>{
        console.log("There was an error in searchURL");
        console.log(err);
    });

    return result;
    
}
// http://hostpoint-admin-panel52358.web65.s177.goserver.host/hostpoint/index.html
// last doc in firebase old version
function searchPromise(document, host, url)
{
    if(document.exists)
    {
        var urlArray = document.data().urls;
        for(var i = 0; i < urlArray.length; i++)
        {
            if(url == urlArray[i])
            {
                return 1;
            }
        }
        return 0;
    }
    return 0;
}

function searchURL2(dbCred, curURL){
    if(typeof(curURL) != "string"){
        return -1;
    }
    var firstSlash = curURL.indexOf('/');
    var hostStart = firstSlash+2;
    var endOfHost = curURL.indexOf('/',hostStart);
    var hostParse = curURL.slice(hostStart,endOfHost);
                        
    // TODO - param check on dbCred


    // encountering lots of promises wonky-ness
    // return the id??
    var URLCollection_promise = dbCred.collection("MaliciousSites2").doc(hostParse)
    .get()
    .then(document => {
        searchPromise(document,hostParse,curURL);
    })
    .catch(err =>
    {
        console.log(err);
    });

    return URLCollection_promise;
}

// the start of the automated data load function. Contacts phishtank and reqests it's data to be loaded into the cloud firestore
// currently traverses to the .json data and requests it. taking that object it is loaded into the cloud firestore
// dbCred = the credentials of the cloud firestore. Currently this function is called from index.js of the node and passed the admin.firestore() credentials
function addToDB(dbCred, malURL){
    if(typeof(malURL) != "string"){
        return 0;
    }

    // TODO param check on dbcred
    var search = searchURL(dbCred,malURL);
    search.then(answer =>{
        if(answer == -1){
            var urlCollection = dbCred.collection("test1");

            urlCollection.doc().set({
                url: malURL
            })
            return 1;
        }
        else{
            return 0;
        }
    }).catch(err =>{
        console.log("There was an error in addToDB");
        return err;
    })
    return search;
}
function documentAdd(collection,url,host){
    collection.doc(host)
    .get()
    .then(document =>{
        if(document.exists){
            //console.log("document data: ", document.data());
            var arr = document.data().urls
            
            if(!arr.find(element => element == url)){
                arr.push(url);

                collection.doc(document.id).set({
                    urls: arr,
                })
            }
            else{
                console.log("this url already exists in the given host");
            }
        }
        else{
            collection.doc(document.id).set({
                urls: [url],
            });
        }
    })
    .catch(error => {
        console.log(error)
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

                newLocationReq.onload = function() {
                    var coll = dbCred.collection("MaliciousSites2");
                    var data = JSON.parse(newLocationReq.responseText);

                    for (i = 0; i<data.length; i++){
                        curURL = data[i].url;
                        
                        //need to parse url to base hostsite.
                        var firstSlash = curURL.indexOf('/');
                        var hostStart = firstSlash+2;
                        var endOfHost = curURL.indexOf('/',hostStart);
                        var hostParse = curURL.slice(hostStart,endOfHost);
                        documentAdd(coll,curURL,hostParse);
                        /*
                        coll.doc(hostParse).get()
                        .then(  document => documentAdd_then(coll, data[i].url, i ,document) )
                        .catch( error =>{
                            console.log(error);
                            console.log("An Error Occured in the Promise");
                        });*/
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
                        
                        //coll.doc(curURL).set({
                        //    fullURL: curURL,
                        //}); 
                       
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
function adminLogin(dbCred, username, password){
    var adColl_prom = dbCred.collection("admin").get();;
    adColl_prom.then(answer => {
        console.log(answer.docs[0].id);
        console.log(answer.doc.data())
    })
}
// TODO
// The framework for the automated update function. This will be very simialr to the Load function above
// and the only differences will be when triggered, how it's triggered, and the comparison piece to update entries
// ----- MAY NEED A TESTING FUNCTION TO DOUBLE CHECK DATA WAS LOADED CORRECTLY ----- //
//function massDataUpdate(dbCred){}
module.exports = {deleteData, addToDB, searchURL, searchURL2, massDataLoad};