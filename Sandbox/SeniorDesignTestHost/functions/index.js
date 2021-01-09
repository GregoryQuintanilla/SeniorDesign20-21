const functions = require('firebase-functions'); // for hosting
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const express = require('express'); // for node app
const app = express(); // for make node app and express app





const testDocRef = db.collection('dummies').doc('greg');
app.get('/',(request, response) =>{
    // This is a fun important piece. Since we are the owners of the server we can do whatever the hell we want and accept request from whatever hosts. I reccommend
    // being atleast familiar with what Cross Origin Resource Sharing (CORS) is and the "idea" behind it. It is a pain in the neck for devs because it is enforced by
    // most browsers. 
 
    response.set('Access-Control-Allow-Origin', '*');
    response.sendFile('public/index.html',{root: __dirname});

    //now that we can have the browser talk to the server (!!!) this is where just straight dev comes in. Time to play around
})
app.get('/addToDB', (request,response) => {
    testDocRef.set({
        name: 'greg',
        age: 22,
    });
    response.send('Added data to the db hopefully');
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
