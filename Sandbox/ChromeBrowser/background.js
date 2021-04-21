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
};

// URL of the current site
// Search for it in the database
// Reformat it
// Add it to the filter
// success?

const webRequestFlags = [
    'blocking',
];

chrome.webRequest.onBeforeRequest.addListener(()=> {
    console.log('Blocking malicious page.');
    //alert('Phishers has identified this page to be malicious.');
    return {
        cancel: true,
    };
}, filter, webRequestFlags);