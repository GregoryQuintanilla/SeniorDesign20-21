// since this is being used by node we need to requrie this API tool specifially because it doesn't come with Node by default.
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//var performance = require('performance').performance;
const { PerformanceObserver, performance } = require('perf_hooks');
/** Deletes a data entry by url
 * dbCred - admin.firestore() object - the object to the firestore you wan tot access
 * URL - string - is the desired URL to be found and removed. 
 * returns nothing to the browser.
 */
function parseURL(URL){
   var firstSlash = URL.indexOf('/');
   if (firstSlash == -1)
   {
       return "Failed to Parse URL";
   }

   var hostStart = firstSlash+2;
   var endOfHost = URL.indexOf('/',hostStart);
   var hostParse = URL.slice(hostStart,endOfHost);

   return hostParse;
}

function deleteData(dbCred, URL){
   if(typeof(URL) != "string"){
       return 0;
   }
   var host = parseURL(URL);
   
   dbCred.collection("test1").doc(host).delete().
   then(ans => {
        console.log("Deletion Resolved");
   })
   .catch(err => {
        console.log(err)
   });
}
// http://hostpoint-admin-panel52358.web65.s177.goserver.host/hostpoint/index.html
// last doc in firebase old version
function searchPromise(document, host, url)
{
    console.log(host);
    console.log(url);
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
// Returns true (1) if URL exists, false (0) if it does not. 
function searchURL(dbCred, curURL){
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
        var answer = searchPromise(document,hostParse,curURL);
        console.log(answer)
        return answer;
    })
    .catch(err =>
    {
        console.log(err);
        return -1
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
    var coll = dbCred.collection("test1");
    var host = parseURL(malURL);
    documentAdd(coll,malURL,host);
    return 1;
}

function documentAdd(collection,url,host){
    collection.doc(host)
    .get()
    .then(document =>{
        if(document.exists){
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

function stageURL(dbCred, curURL){
    var coll = dbCred.collection("StagedSites");
    var firstSlash = curURL.indexOf('/');
    var hostStart = firstSlash+2;
    var endOfHost = curURL.indexOf('/',hostStart);
    var hostParse = curURL.slice(hostStart,endOfHost);
    documentAdd(coll,curURL,hostParse);
}
// TODO
// The framework for the automated update function. This will be very simialr to the Load function above
// and the only differences will be when triggered, how it's triggered, and the comparison piece to update entries
// ----- MAY NEED A TESTING FUNCTION TO DOUBLE CHECK DATA WAS LOADED CORRECTLY ----- //
//function massDataUpdate(dbCred){}
module.exports = {deleteData, addToDB, searchURL, massDataLoad, stageURL};