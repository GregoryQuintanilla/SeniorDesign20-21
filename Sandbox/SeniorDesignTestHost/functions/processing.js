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



// My Preference but it won't kill me if y'all disagree

const https = require('https');
const options = {
    hostname: '',
    port: 443,
    path:  '/',
    method: 'GET'
};

function test(){
    console.log("This is a test function from an external js file.")
}

function test2(){
    console.log("This is the SECOND functio to test how the exporting works really.")
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

module.exports = {test, test2, checkDomainAge};