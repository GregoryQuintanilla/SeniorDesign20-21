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
app.get('/massDataLoad', (request,response) => {
    response.set('Access-Controle-Allow-Origin','*');

    console.log("callinng function");
    // Signal to trigger the back end DB loading.
    var data = databasefuncs.massDataLoad(firestoreDB); // make this async at some point? We don't need this to wait for the system to return back

    //console.log(data)
    console.log("Called function");

    response.send("hopefully data is mass loaded. idk.")
});
app.get('/del', (request, response) => {
    response.set('Access-Control-Allow-Origin','*');
    databasefuncs.deleteData(firestoreDB,"https://www.centraleconsulta.net/index2.php");
    response.send("Deleted code specified entries");
})
app.get('/addToDB', (request,response) => {
    databasefuncs.addToDB(firestoreDB,"https://www.centraleconsulta.net/index2.php");
    response.send('Added data to the db hopefully');
});

app.get('/findURL', (request, response) => {
    response.set('Access-Control-Allow-Origin','*');
    var positive = databasefuncs.searchURL(firestoreDB,"http://pt-o.top/awb.html");
    var negative = databasefuncs.searchURL(firestoreDB,"http://www.google.com");
    console.log("SENDING RESPONSE??");
    positive.then(answer => {
        response.send(answer);
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
    const givenURL = new URL(request.query.link);

    // Add document for URL
    testDocRef.doc('urlTest').set({
        url: `${givenURL}`,
        online: 'true'
    });
    // If valid
    response.send(`Added ${givenURL} to database.`);
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
            var code = processing.getSourceCode(url);

            code.then(result => {
                // Stage 1: Check to see if the URL exists in our database first
                var foundInDb = false;

                // Search through DB here

                if (foundInDb) {
                    response.send("Site found in our phishing DB."); // If found, cut processing here.
                }else{
                    // Stage 2: If URL not found, begin processing methods here
                    var containsSSL = processing.urlContainsSSL(url);
                    var containsIP = processing.urlContainsIP(url);
                    var containsAt = processing.urlContainsAt(url);
                    var numInput = processing.inputFields(result);
                    var numKeyPhrases = processing.keyPhrases(result);
                    var score = 0;

                    if (numInput==0){ score-=20 } else score += numInput*2; // if no input fields, likely not malicious
                    if (numKeyPhrases==0){ score-=20 } else score += numKeyPhrases*2;
                    if (containsIP) score+=10;
                    if (containsSSL){ score-=2 } else score += 5; // if http, +5 points - (not recognizing HTTP right now for some reason)
                    if (containsAt) score+=25;

                    // var src = "Website: " + url + " has " + count + " input fields." + " <br><br>" + result.replace(/[<]/g, "<'"); 
                    var debug = `Website: ${url} has ${numInput} input field(s), has ${numKeyPhrases} key phrase(s), containsIP?: ${containsIP}, containsSSL?: ${containsSSL}, 
                    containsAt? ${containsAt}.`; 

                    var serverResponse = `This website has scored ${score} points. ${debug}`;
                    response.send(serverResponse);
                }
            }).catch(err => {
                //console.warn('Something went wrong in /getSourceCode route.', err);
                response.send(`Something went wrong in /getSourceCode route. Reason: ${err}.`);
             });
        }
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.app = functions.https.onRequest(app);
