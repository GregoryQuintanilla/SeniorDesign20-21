const functions = require('firebase-functions'); // for hosting
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const express = require('express'); // for node app
const app = express(); // for make node app and express app
const processing = require("./processing.js"); // this is the processing js file. The String needs to be the path to the file.
const https = require('https');
const url = require('url');








const testDocRef = db.collection('dummies');
app.get('/',(request, response) =>{
    // This is a fun important piece. Since we are the owners of the server we can do whatever the hell we want and accept request from whatever hosts. I reccommend
    // being atleast familiar with what Cross Origin Resource Sharing (CORS) is and the "idea" behind it. It is a pain in the neck for devs because it is enforced by
    // most browsers. 
 
    response.set('Access-Control-Allow-Origin', '*');
    response.sendFile('public/index.html',{root: __dirname});

    //now that we can have the browser talk to the server (!!!) this is where just straight dev comes in. Time to play around
})
app.get('/addToDB', (request,response) => {
    testDocRef.doc('greg').set({
        name: 'greg',
        age: 22,
    });
    response.send('Added data to the db hopefully');
});

// Test Function to see how interacting with external js files works.
app.get('/testExternalFunctions', (request,response) => {
    console.log(processing);
    processing.test();
    processing.test2();
    response.send("Sucess!")
});

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

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.app = functions.https.onRequest(app);
