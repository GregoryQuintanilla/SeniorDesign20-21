// checks when the user navigates to a new url and displays alters if found in DB, not yet for precessing
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    var tabURL = changeInfo.url;
    var baseServerURL = "https://us-central1-senior-design-test-host.cloudfunctions.net/app/processSite?link=";

    var fullURL = baseServerURL + tabURL;

    if (tabURL != undefined && tabURL != "chrome://newtab/") {

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", fullURL, true);
        xmlHttp.onload = function(){
            if (this.responseText == "Not safe - in database"){
                confirm("!! WARNING !! This site was found in a phishing database. Would you like to continue browsing the page? ");
                console.log(fullURL);
                console.log(this.responseText);
            } else if (this.responseText == "Not safe - determined") { 
                confirm("!! WARNING !! This site was determined to potentially be phishing. Would you like to continue browsing the page? ");
                console.log(fullURL);
                console.log(this.responseText);
            } else if (this.responseText == "Safe") {
                console.log(fullURL);
                console.log(this.responseText);
            } else {
                console.log(fullURL);
                console.log("Response from server: " + this.responseText);
            }
        };
        xmlHttp.send();
    }
});


/***
 *variable Declarations 
 * 
 *****/
//Global variable to hold the active tab name **Check whether it should be the whole url or the hostname 
var activeTabName = "";
var URLforDB = "";


/***
 *Getting the URL 
 * 
 *****/

//This loads once a tab loads 
chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
}, function(tabs) {
    // and use that tab to fill in out title and url
    var tab = tabs[0];
    console.log(tab.url);
    //alert(tab.url); - Testing purposes ~ Instead of an alert just set the report tabs value 
    
    var nameURL = tab.url //This will return the whole link to pass in
    var Hostname = extractHostname(tab.url); //This will return just the host name to pass in   ---****Visuals :: Host name  - Send it on the other side-use both. Bad host domains ban itnumerous reports
    //*****Click and highlight it -show all the url to the user 


    //Set the global variable 
    activeTabName = Hostname;
    URLforDB = nameURL;

    if(!isNull('website-display')){
        document.getElementById('website-display').value = nameURL;
        document.getElementById('website-display').title = nameURL        
        document.getElementById('website-display').addEventListener("mouseover", mouseOver);
        document.getElementById('website-display').addEventListener("mouseout", mouseOut);
        }
});


/***
 * Database Methods 
 * 
 *****/
//This is called once the report button is pressed after everything has been loaded

document.addEventListener('DOMContentLoaded', function() {
    if(!isNull('button-display')){
    document.getElementById("button-display").addEventListener("click", ReportWebsite);
    }
  });

function ReportWebsite() //Reports site to the database when the button is pressed
{
    var baseServerURL = "https://us-central1-senior-design-test-host.cloudfunctions.net/app/reportLink?link=";
    var reportURL = URLforDB;
    var matchStr = "Added " + reportURL + " to database.";

    var fullURL = baseServerURL + reportURL;
    var bkg = chrome.extension.getBackgroundPage();

    var xmlHttp2 = new XMLHttpRequest();

    xmlHttp2.open("GET", fullURL, true);
    xmlHttp2.onload = function(){
        if (this.responseText == matchStr){
            confirm("Thank you for your contribution! We will review your submission. ");
            bkg.console.log(fullURL);
            bkg.console.log(this.responseText);
        } else { 
            confirm("Something went wrong with processing your request. We apologize for the inconvenience.");
            bkg.console.log(fullURL);
            bkg.console.log("Response from server: " + this.responseText);
        }
    };
    xmlHttp2.send();
}

//Determines whether or not an object is null 
function isNull(ObjectName)
{
    if(document.getElementById(ObjectName) == null)
    {
        return true;
    }
    return false
}
    
    /* Aternative connections to backend -----------------------------------------------
    xmlHttp2.onreadystatechange = function(){
        //alert(fullURL);
        if (xmlHttp2.readyState == XMLHttpRequest.DONE) {
            alert("Deployed - Thank you for your contribution! We will review your submission.");
        }
        //bkg.console.log("hiii " + this.responseText);
        // bkg.console.log(fullURL);
        //alert(this.responseText);
        //if (this.responseText == matchStr){
            //confirm("Thank you for your contribution! We will review your submission.");
        //} else{
            //?
        //}
    };
    xmlHttp2.send();

    //alert(fullURL);

    //if (reportURL != undefined && reportURL != "chrome://newtab/") {
         //alert(changeInfo.url);

        // var xmlHttp = new XMLHttpRequest();
        // xmlHttp.open("GET", fullURL, true);
        // xmlHttp.onload = function(){
        //     alert(this.responseText);
        //     //if (this.responseText == matchStr){
        //         //confirm("Thank you for your contribution! We will review your submission.");
        //     //} else{
        //         //?
        //     //}
        // };
        // xmlHttp.send();
        //confirm(fullURL);
    //}
    //alert(URLforDB);
    //console.log(URLforDB)
    ------------------------------------------------------------- */

/***
 * Helper Methods 
 * 
 *****/

function mouseOver() {
    document.getElementById('website-display').style.color = "red";
  }
  
  function mouseOut() {
    document.getElementById('website-display').style.color = "black";
  }

//Returns a boolean determining whether or not the report button was null
function ReportBtnIsNotNull()
{
    var btn = document.getElementById('button-display');
if(btn){
return true;
}
return false;
}

//Extracts the host name from the given url
function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

/*
var xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", "https://us-central1-senior-design-test-host.cloudfunctions.net/app/timestamp", true);
xmlHttp.onload = function(){
    console.log(this.responseText);
    confirm("Would you like to continue browsing the page?");
};
xmlHttp.send();

const filter = {
    urls: [
        //'*://www.google.com/*',
        '*://www.hofstra.edu/*',
    ],
}; */

/*chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
        console.log("The color is green.");
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher(
                {
                    pageUrl: {hostEquals: 'developer.chrome.com'},
                })

            ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        var url = "";
    
        // get the url everytime the user changes url
        chrome.tabs.query({active: true, lastFocusedWindow: true},tabs =>{
            url = tabs[0].url;
    
            var bkg = chrome.extension.getBackgroundPage();

            if (url != undefined){ // not a new tab with no url
                bkg.console.log(url); // for testing, send URL to node server??

                // Gets the source code of the website
                fetch(url).then(function (response) { // The API call was successful!
                    mode: 'no-cors'
                    return response.text();
            
                }).then(function (html) {
                    var bkg = chrome.extension.getBackgroundPage();
                    bkg.console.log(html); // testing
            
                }).catch(function (err) { // There was an error
                    console.warn('Something went wrong.', err);
                });
            }
        }); // chrome.tabs.query

    });  // chrome.tabs.onUpdated

}); // chrome.runtime.onInstalled*/


// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     var url = "";

//     // get the url everytime the user changes url
//     chrome.tabs.query({active: true, lastFocusedWindow: true},tabs =>{
//         url = tabs[0].url;

//         var bkg = chrome.extension.getBackgroundPage();

//         if (url != undefined){ // not a new tab with no url
//             bkg.console.log(url); // for testing, send URL to node server??

//             var xmlHttp = new XMLHttpRequest();
//             xmlHttp.open("GET", "https://us-central1-senior-design-test-host.cloudfunctions.net/app/timestamp", true);

//             xmlHttp.onload = function(){
//             //console.log(this.responseText);
//             //alert(this.responseText);
            
//         };
//             xmlHttp.send();
//         }

//     }); // chrome.tabs.query
// });  // chrome.tabs.onUpdated


// var xmlHttp = new XMLHttpRequest();
// xmlHttp.open("GET", "https://us-central1-senior-design-test-host.cloudfunctions.net/app/timestamp", true);

// xmlHttp.onload = function(){

//     console.log(this.responseText);
//     confirm("Would you like to continue browsing the page?");

// };
// xmlHttp.send();

// const filter = {
//     urls: [
//         //'*://www.google.com/*',
//         '*://www.hofstra.edu/*',
//     ],
// };

// URL of the current site
// Search for it in the database
// Reformat it
// Add it to the filter
// success?

// const webRequestFlags = [
//     'blocking',
// ];

/* chrome.webRequest.onBeforeRequest.addListener(()=> {
    console.log('Blocking malicious page.');
    //alert('Phishers has identified this page to be malicious.');
    return {
        cancel: true,
    };
}, filter, webRequestFlags); */

// chrome.webRequest.onBeforeRequest.addListener(()=> {
//     console.log('Blocking malicious page.');
//     //alert('Phishers has identified this page to be malicious.');
//     return {
//         cancel: true,
//     };
// }, filter, webRequestFlags);


/*chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab)
{
    if (changeInfo.status == 'complete'){
        console.log(tabId);
        console.log(tab);
        console.log(tab);

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "https://localhost:5000/toServer", false); 
        xmlHttp.onload = function(){
            console.log("hello there");
        };
        xmlHttp.send(null);
        console.log(xmlHttp.requestText);
    }
});*/
// chrome.webRequest.onBeforeRequest.addListener(function(details) {
//     console.log(details);
//     console.log("Before load");
// },{urls: ["<all_urls>"]});
