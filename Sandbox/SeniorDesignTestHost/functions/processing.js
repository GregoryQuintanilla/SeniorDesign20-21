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

const https = require('https');
const options = {
    hostname: '',
    port: 443,
    path:  '/',
    method: 'GET'
};

// since this is being used by node we need to requrie this API tool specifially because it doesn't come with Node by default.
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

function test(){
    console.log("This is a test function from an external js file.")
}

function test2(){
    console.log("This is the SECOND functio to test how the exporting works really.");
}

function massDataLoad(){
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
                newLocationReq.onload = function () {
                    console.log("New Request Sent & Recieved");
                    //console.log(newLocationReq);
                    var data = JSON.parse(newLocationReq.responseText);
                }
                newLocationReq.send(null);
           //var headers = phsihTankReq.getResponseHeaders();
           //console.log(headers);
       };
    }

   phishTankReq.send(null);
   //return phishTankReq;
}

// Expects a domain to be passed and will return the age of the domain.
function checkDomainAge(domain){
    var api = `https://api.ip2whois.com/v1?key=4LIWHQR89M9U6P8VXRPUI2HTX2X4OXAJ&domain=${domain}`; // API URL
    var age, createDate, updateDate;
    // Perform an HTTPS get request on the api url
    https.get(`${api}`, resp => {
        let data = "";
        resp.on("data", chunk => {
            data += chunk;
        });
        resp.on("end", () => {
            // Grab domain age
            age = JSON.parse(data).domain_age;
            console.log(age);
            // Grab domain creation date
            createDate = JSON.parse(data).create_date;
            console.log(createDate);
            // Grab domain update date
            updateDate = JSON.parse(data).update_date;
            console.log(updateDate);
        });
    })
    .on("error", err => {
        console.log("Error: " + err.message);
    });
    return age;
}

function getSourceCode(url){
    // Retrieves the source code of a site from its URL
    const fetch = require('node-fetch');

    var result = fetch(url).then(function (response) { // The API call was successful!
        mode: 'no-cors'
        return response.text();

    }).then(function (html) { //return source code retrieved from url
        return html;

    }).catch(function (err) { // There was an error
        console.warn('Something went wrong in getSourceCode().', err);
    });
    
    return result; // return entire source code
}

function inputFields(sourceCode){
    // Checks for specific types if input fields in code common to phishing sites
    var count = 0;

    count += (sourceCode.match(/type="text"/g) || []).length;
    count += (sourceCode.match(/type="email"/g) || []).length;
    count += (sourceCode.match(/type="password"/g) || []).length;
    count += (sourceCode.match(/type="number"/g) || []).length;
    count += (sourceCode.match(/type="submit"/g) || []).length;
    count += (sourceCode.match(/<form/g) || []).length;

    return count;
}

function urlContainsIP(siteLink){ 
    // Checks if a URL contains an IP address
    return (siteLink.match(/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g) != null);
 };

function urlContainsSSL(siteLink){ // checks whether the site contains an SSL certificate
    const splitStr = siteLink.split('/');   //Split the url
    
    return splitStr[0].includes("https");
}

function keyPhrases(sourceCode){
    // Checks for alarming key words often used in phishing sites
    var count = 0;

    sourceCode = "dlsdksld claim now, for free Urgent lol";

    count += (sourceCode.match(/[U|u]rgent/g) || []).length;
    count += (sourceCode.match(/!!/g) || []).length;
    count += (sourceCode.match(/[D|d]elivery [A|a]ttempt/g) || []).length;
    count += (sourceCode.match(/[A|a]ct [N|n]ow/g) || []).length;
    count += (sourceCode.match(/[C|c]laim [N|n]ow/g) || []).length;
    count += (sourceCode.match(/[F|f]ree/g) || []).length;
    count += (sourceCode.match(/[W|w]inner/g) || []).length;
    count += (sourceCode.match(/[S|s]ocial [S|s]ecurity/g) || []).length;

    console.log(count);

    return count;
}

function urlPeriodAmt(siteLink){ // checks whether the site url contains periods
    var count = siteLink.split(".").length - 1;
    
    return count;
 };

function urlContainsAt(siteLink){ // checks whether the site contains an "@"
    return siteLink.includes("@");
}

function urlDashesAmt(siteLink){ // checks whether the site url contains periods
    var count = siteLink.split("-").length - 1;
    
    return count;
 };

module.exports = {test,test2, massDataLoad, getSourceCode, inputFields, urlContainsIP, urlContainsAt, urlContainsSSL, urlPeriodAmt, urlDashesAmt, keyPhrases, checkDomainAge};
