// since this is being used by node we need to requrie this API tool specifially because it doesn't come with Node by default.
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//var performance = require('performance').performance;
const { PerformanceObserver, performance } = require('perf_hooks');
/** Deletes a data entry by url
 * dbCred - admin.firestore() object - the object to the firestore you wan tot access
 * URL - string - is the desired URL to be found and removed. 
 * returns nothing to the browser.
 */
function parseURL(URL)
{   
    if(typeof URL != "string"){
        console.log("Invalid data at HostParse. Provided URL is not a String");
        return -1;
    }

    var firstSlash, hostStart;
    if(URL.startsWith('https://') || URL.startsWith('http://'))
    {
        firstSlash = URL.indexOf('/');
        hostStart = firstSlash+2;
    }
    else{
        hostStart = 0;
    }

    if (firstSlash == -1)
    {
        console.log("Failed to Parse URL");
        return -1;
    }

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
    //console.log(host);
    //console.log(url);
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
        return -1;
    }
    return -2;
}
// Returns true (1) if URL exists, false (0) if it does not. 
function searchURL(dbCred, curURL){
    if(typeof(curURL) != "string"){
        return -2;
    }
    var firstSlash = curURL.indexOf('/');
    var hostStart = firstSlash+2;
    var endOfHost = curURL.indexOf('/',hostStart);
    var hostParse = curURL.slice(hostStart,endOfHost);
    var responseVal;
                        
    // TODO - param check on dbCred
    // encountering lots of promises wonky-ness
    // return the id??
    /*var URLCollection_promise = dbCred.collection("MaliciousSites2").doc(hostParse)
    .get()
    .then(document => {
        searchPromise(document,hostParse,curURL);
    */
    var URLCollection_promise = dbCred.collection("MaliciousSites2").doc(hostParse).get()
    var responseVal = URLCollection_promise.then(document => {
        if(document.exists)
        {
            var urlArray = document.data().urls;
            for(var i = 0; i < urlArray.length; i++)
            {
                if(curURL == urlArray[i])
                {
                    return 1;
                }
            }
            return -1;
        }
        return -1;
    })
    .catch(err =>
    {
        console.log(err);
        return -1
    });
    return responseVal;
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

function documentAdd(collection,id,data){ // host, urls
    collection.doc(id)
    .get()
    .then(document => {
        if(document.exists)
        {   
            var newData = []
            console.log(document.id);
            data.urls.foreach(newDataEle =>{
                document.data().urls.foreach(oldDataEle =>{
                    if(oldDataEle != newDataEle){
                        newDataEle.push(newData);
                    }
                })

            })
            newData.concat(document.data().urls)
            //var newData = document.data().urls.concat(data); 
            collection.doc(id).update({urls:newData});

        }
        else{
            collection.doc(id).set(data);
        }
    })
    .catch(error => {
        console.log(error)
    });
            /*
            var docData = document.data();
            for(newElement in data)
            {
                for(exisitingElement in data){
                    if(newElement == oldElement){
                        document.data() = newElement;
                    }
                    if(!(newElement in docData))
                    {
                        document.data().newElement = data[newElement];
                    }
                }
            }
            
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
            collection.doc(document.id).set(data);
        } */
}

function documentAdd_Stage(collection,url,host){
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
                    var coll = dbCred.collection("newMassTest");
                    var data = JSON.parse(newLocationReq.responseText);
                       for (i = 0; i<data.length; i++){
                           curURL = data[i].url;
                           var hostParse = parseURL(curURL);

                           //var document = coll.doc("pineapple");
                           //console.log(document);
                           documentAdd(coll,hostParse,{urls:[curURL]})
                           /*.get()
                           .then(document => massDataLoadAdd_promise(document,coll,hostParse,curURL))
                           .catch(err => { console.log(err); });*/
                      } 
                }
                newLocationReq.send(null);
       }; 
    }

   phishTankReq.send(null);
   //return phishTankReq;
}

function massDataLoadAdd_promise(document,collection,id,curURL){
    console.log("ID: ",id,"\nURL: ",curURL,"\n");
    if(document.exists)
    { 

        var docData = document.data()
        docData.urls.push(curURL);
        documentAdd(collection,id,docData);
    }
    else
    {
        documentAdd(collection,id,{urls:[curURL]});
    }
}

function adminLogin(dbCred, username, password){
    var adColl_prom = dbCred.collection("admin").get();;
    adColl_prom.then(answer => {
        console.log(answer.docs[0].id);
        console.log(answer.doc.data())
    });
}
function addToStage(collection, url, data)
{
    collection.doc(url)
    .get(document =>{
        if(document.exists)
        {
            var documentData = document.data();
            if(documentData.submissions ==4)
            {
                documentAdd(dbCred.collection("MaliciousSites"),document.id,{urls:docData.urls});
            }
        }
    });
}
function preStageURL(dbCred,curURL){
    searchURL(dbCred,curURL)
    .then(response =>
    {   
        console.log(response);
        if(response)
        {
            console.log("URL already exists in our Database");
            return 1;
        }
        stageURL(dbCred,curURL);
    })
    .catch(err=>{
        console.log("Error: preStageURL:");
        console.log(err);
    });
}

function stageURL(dbCred, curURL){
    var coll = dbCred.collection("StagedSites");
    var hostParse = parseURL(curURL);
    coll.doc(hostParse).get()
    .then(document =>
    {
        if(document.exists)
        {
            console.log("this document exisits");
            var docData = document.data();
            if(docData["submissions"] == 4)
            {
                //remove from staging and add to real
                documentAdd(dbCred.collection("newMassTest"),document.id,{urls:[docData.urls]})
                coll.doc(document.id).delete()
                return 1;
            }
            docData.submissions++;
            coll.doc(document.id).update(docData).then(upDocument=>
            {
                console.log("The following document has been updated");
                return 1;
            }).catch(err =>{
                console.log("Error updating document:");
                console.log(err);
                return -1;
            });
        }
        else{
            var hostParse = parseURL(curURL);
            documentAdd(coll,hostParse,{urls:curURL,submissions:1})
            return 1;
        }
    })
    .catch(err => {
        console.log("Error: stageURL:");
        console.log(err);
        return -1;
    });
}
// TODO
// The framework for the automated update function. This will be very simialr to the Load function above
// and the only differences will be when triggered, how it's triggered, and the comparison piece to update entries
// ----- MAY NEED A TESTING FUNCTION TO DOUBLE CHECK DATA WAS LOADED CORRECTLY ----- //
//function massDataUpdate(dbCred){}
module.exports = {deleteData, addToDB, searchURL, massDataLoad, preStageURL};