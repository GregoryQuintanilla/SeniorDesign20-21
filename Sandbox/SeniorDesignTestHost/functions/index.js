const functions = require('firebase-functions'); // for hosting
const admin = require('firebase-admin');
admin.initializeApp();


const RealTimeDB = admin.database();
const firestoreDB = admin.firestore();

const express = require('express'); // for node app
const app = express(); // for make node app and express app

const databasefuncs = require("./tools/databasefuncs.js"); // this is the databasefunction js file. The String needs to be the path to the file.
const processing = require("./processing.js"); // this is the processing js file. The String needs to be the path to the file.
const https = require('https');
const url = require('url');


const testDocRef = firestoreDB.collection('dummies');

app.get('/',(request, response) =>{
    // This is a fun important piece. Since we are the owners of the server we can do whatever the hell we want and accept request from whatever hosts. I reccommend
    // being atleast familiar with what Cross Origin Resource Sharing (CORS) is and the "idea" behind it. It is a pain in the neck for devs because it is enforced by
    // most browsers. 
 
    response.set('Access-Control-Allow-Origin', '*');
    response.sendFile('public/index.html',{root: __dirname});

    //now that we can have the browser talk to the server (!!!) this is where just straight dev comes in. Time to play around
})

app.get('/addToRealTimeDB',(request,response) =>{
    /*RealTimeDB.ref('usrs/testURL').set({
        url: 'abc.com',
        id: 1
    });*/
    response.send(admin.auth().app);
});
// testing route
app.get('/massDataLoad', (request,response) => {
    response.set('Access-Controle-Allow-Origin','*');

    console.log("callinng function");
    // Signal to trigger the back end DB loading.
    var data = databasefuncs.massDataLoad(firestoreDB); // make this async at some point? We don't need this to wait for the system to return back

    //console.log(data)
    console.log("Called function");

    response.send("hopefully data is mass loaded. idk.")
});

//testing route
app.get('/del', (request, response) => {
    response.set('Access-Control-Allow-Origin','*');
    //databasefuncs.deleteData(firestoreDB,"https://www.centraleconsulta.net/index2.php");
    databasefuncs.deleteData(firestoreDB, "https://www.centraleconsulta.net/index2.php");
    response.send("Deleted code specified entries");
})
// testing rout
app.get('/addToDB', (request,response) => {
    databasefuncs.addToDB(firestoreDB,"https://www.centraleconsulta.net/index2.php");
    response.send('Added to Database');
});
// testing route
app.get('/Stage', (request,response) => {
    databasefuncs.preStageURL(firestoreDB, "www.GregsMaliciousSite.phish.net/sendPhish/phishyphish.php");
    response.send("Staged?");
}
)

app.get('/findURL', (request, response) => {
    response.set('Access-Control-Allow-Origin','*');
    //var search = databasefuncs.searchURL(firestoreDB,"http://000032818.com/banks/Tangerine");
    var search = databasefuncs.searchURL(firestoreDB,"http://www.google.com");
    console.log("back in the routing");
    console.log(search);
    search.then(answer => {
        console.log("answer is ", answer);
        if(answer == 1)
        {
            response.json({status:100,found:1});
        }
        else{
            response.json({status:100,found:0});
        }
    })
    .catch(err =>
    {
        response.sendStatus(500);
    });
    //response.send("Postivie: " + String(positive) + " and Negative: " + String(negative));
})

// Test Function to see how interacting with external js files works.

app.get('/domainAge', (request, response) => {
    var URL = "google.com";
    var domainAge = processing.checkDomainAge(URL);
    response.send(domainAge);
});

app.get('/getData', (request,response) => {
    const doc = testDocRef.doc('john').get();
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        console.log('Document data:', doc.data());
    }
    console.log('Document data:', doc.data());
    response.send('Hit API');
});

app.get('/reportLink', (request, response) => {
    // Generate URL object
    var url = request.query.link;

    // Add document for URL
    databasefuncs.stageURL(firestoreDB, url);
    // If valid
    response.send(`Added ${url} to database.`);
});

app.get('/timestamp', (request, response) => {
    response.send(`${Date.now()}`);
});

app.get('/timestamp-cached',(request, response) => {
    response.set('Cache-Control','public, max-age=300, s-maxage=600');
    response.send(`${Date.now()}`);
});

app.get('/getSourceCode', (request, response) => {
    // displays entire source code of a site
    var url = request.query.link;

        if(request.query.link == undefined || request.query.link == "") {
            //no link, do nothing
            response.send("URL cannot be undefined");
        
        } 
        else {
            var code = processing.getSourceCode(url);

            code.then(result => {
                var src = "Retrieving source code for: " + url + " <br><br>"+ result.replace(/[<]/g, "<'"); // convert source code to prevent browser from rendering

                response.send(src);

            }).catch(err => {
                response.send(err);
             });
        }
});

app.get('/numInputFields', (request, response) => {
    // displays the number of input fields found in the source code of a site
    var url = request.query.link;

        if(request.query.link == undefined || request.query.link == "") {
            //no link, do nothing
            response.send("URL cannot be undefined");

        } else {
            var code = processing.getSourceCode(url);

            code.then(result => {
                var count = processing.inputFields(result);

                // var src = "Website: " + url + " has " + count + " input fields." + " <br><br>" + result.replace(/[<]/g, "<'"); 
                var src = "Website: " + url + " has " + count + " input fields."; 

                response.send(src);

            }).catch(err => {
                console.warn('Something went wrong in /numInputFields route.', err);
             });
        }
});

app.get('/processSite', (request, response) => {
    // processes the given URL to determine if malicious
    var url = request.query.link;

        if(request.query.link == undefined || request.query.link == "") {
            //no link, do nothing
            response.send("URL cannot be undefined");

        } else {
            // Begin Stage 1: search in DB
            response.set('Access-Control-Allow-Origin','*');

            var DBSearchResponse = databasefuncs.searchURL2(firestoreDB, url);

            DBSearchResponse.then(answer => {
                if (answer == -2){ // URL is not a not string
                    response.send("URL is not a string");
                } else if(answer == -1){  // not found in DB

                    // Stage 2: If URL not found, begin processing methods here
                    var code = processing.getSourceCode(url);

                    code.then(result => {
                        var containsSSL = processing.urlContainsSSL(url);
                        var containsIP = processing.urlContainsIP(url);
                        var containsAt = processing.urlContainsAt(url);
                        var containsKeys = processing.urlContainsKeyPhrase(url);
                        var containsPort = processing.urlContainsPort(url);
                        var containsShortener = processing.urlContainsShortener(url);
                        if (result.toString().includes("FetchError")) {
                            response.send("Site down");
                        } else {
                            var numInput = processing.inputFields(result);
                            var numKeyPhrases = processing.keyPhrases(result);
                            var score = 0;

                            if (numInput==0){ score+=20 } else score -= numInput*2; // if no input fields, likely not malicious
                            if (numKeyPhrases==0){ score+=20 } else score -= numKeyPhrases*2;
                            if (containsIP) score-=15;
                            if (!containsSSL && numInput>0){ score-=50; } // http and login field
                            else if (containsSSL){ // https
                                score += 2;
                            } else { // http
                                score -= 5;
                            }
                            score -= 5;
                            if (containsAt) score-=25;
                            if (containsKeys) score-=5;
                            if (containsPort) score-=10;
                            if (containsShortener) score-=5;
 
                            var debug = `Website: ${url} has ${numInput} input field(s), has ${numKeyPhrases} key phrase(s), containsIP?: ${containsIP}, containsSSL?: ${containsSSL}, 
                            containsAt? ${containsAt}, containsKeys?: ${containsKeys}, containsPort?: ${containsPort}.`; 

                            var serverResponse = `This website has scored ${score} points. ${debug}`;

                            if (score<=-25) {
                                response.send("Not safe - determined") ;
                                //response.send(serverResponse); // DEBUG LINE
                            } else {
                                response.send("Safe");
                                //response.send(serverResponse); // DEBUG LINE 
                            }
                        }
                    }).catch(err => {

                    response.send("Site down");
                });

                } else if (answer == 1) { // found url in DB at some position
                    response.send("Not safe - in database"); // If found, cut processing here.
                } else {
                    response.send("err");
                }
            }).catch(err => {
                console.warn("An error occured in processSite route while searching the DB", err);
            });

        }
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.app = functions.https.onRequest(app);
