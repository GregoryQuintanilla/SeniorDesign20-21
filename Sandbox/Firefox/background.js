alert("Warning: This site is potentially phishing!!");

//------------------------------------------------------------------------------------------
// Code below is commented for throwing errors in Firefox since "chrome" is not recognized 
//------------------------------------------------------------------------------------------

// chrome.runtime.onInstalled.addListener(function() {
// //     chrome.storage.sync.set({color: '#3aa757'}, function() {
// //         console.log("The color is green.");
// //     });
// //     chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
// //         chrome.declarativeContent.onPageChanged.addRules([{
// //             conditions: [new chrome.declarativeContent.PageStateMatcher(
// //                 {
// //                     pageUrl: {hostEquals: 'developer.chrome.com'},
// //                 })

// //             ],
// //                 actions: [new chrome.declarativeContent.ShowPageAction()]
// //         }]);
// //     });

//     chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//         var url = "";
    
//         // get the url everytime the user changes url
//         chrome.tabs.query({active: true, lastFocusedWindow: true},tabs =>{
//             url = tabs[0].url;
    
//             var bkg = chrome.extension.getBackgroundPage();

//             if (url != undefined){ // not a new tab with no url
//                 bkg.console.log(url); // for testing, send URL to node server??

//                 // Gets the source code of the website
//                 fetch(url).then(function (response) { // The API call was successful!
//                     mode: 'no-cors'
//                     return response.text();
            
//                 }).then(function (html) {
//                     var bkg = chrome.extension.getBackgroundPage();
//                     bkg.console.log(html); // testing
            
//                 }).catch(function (err) { // There was an error
//                     console.warn('Something went wrong.', err);
//                 });
//             }
//         }); // chrome.tabs.query

//     });  // chrome.tabs.onUpdated

// }); // chrome.runtime.onInstalled

// /*chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab)
// {
//     if (changeInfo.status == 'complete'){
//         console.log(tabId);
//         console.log(tab);
//         console.log(tab);

//         var xmlHttp = new XMLHttpRequest();
//         xmlHttp.open("GET", "https://localhost:5000/toServer", false); 
//         xmlHttp.onload = function(){
//             console.log("hello there");
//         };
//         xmlHttp.send(null);
//         console.log(xmlHttp.requestText);
//     }
// });*/
// // chrome.webRequest.onBeforeRequest.addListener(function(details) {
// //     console.log(details);
// //     console.log("Before load");
// // },{urls: ["<all_urls>"]});