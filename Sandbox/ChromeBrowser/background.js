chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    var tabURL = changeInfo.url;
    var baseServerURL = "https://us-central1-senior-design-test-host.cloudfunctions.net/app/processSite?link=";
    var test = "timestamp";

    var fullURL = baseServerURL + tabURL;
    console.log(fullURL);

    if (tabURL != undefined && tabURL != "chrome://newtab/") { // regex for anything match chrome://??
        //alert(changeInfo.url);

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", fullURL, true);
        xmlHttp.onload = function(){
        if (this.responseText == "Site found in our phishing DB."){
            console.log(this.responseText);
            confirm("!! WARNING !! This site is potentially phishing. Would you like to continue browsing the page? " + this.responseText);
        } else { // receive score from server and check or do nothing if its safe since dont want to bother user
            console.log(this.responseText);
        }

        };
        xmlHttp.send();
   
        //confirm(fullURL);
    }
});





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