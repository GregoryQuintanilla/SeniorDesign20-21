# Setting up the Chrome Extension
This is my best attempt at a guide to bring yall up to speed on how I did this. I apologise for hard to read or poorly explained pieces. Sincerely, Greg.

## Guide
1. First thing is actually following this tutorial. https://developer.chrome.com/docs/extensions/mv2/getstarted/. This will take you through most
of the extension building process. Anything I did was in addition to what was brought up from here. Once you're done with this guide you should
have the manifest, background (js and html), options (js and html), and popup (js and html) as well as the imgs set up. I did mine to have the
logo we made but for now it doesn't really matter.
2. Now for the pieces I've added. **Note: for this to be fully complete you need to have the firebase hosting the node app**, but we can get it up
to that point. If you followed the manifest from the tutorial go to my version of the manifest in the GitHub and add anything that isn't already
there. I belive this to be items in the permissions section, such as the links, and other api requests `activeTab` and `declarativeContent`. These
allow for the extension to call apon more APIs than just the `storage` one. This gives us more functionality. I'm not really sure whether we need
the links, so just have them for now.
3. Update popup.js. Add these following lines to the popup.js file (or just pull the one from github)
```
let getReq = document.getElementById('getReq'); // grabs the button on the page
var bkg = chrome.extension.getBackgroundPage(); // grabs the background page for the extension. See guide in github fro explanation.

getReq.onclick = function(element) { // adding an onlick function to the button
    bkg.console.log("Sending request to app"); //logging to check the button is atleast working.
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ // this is some chrome extension stuff. I'm not 100% on all of it
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'var xmlHttp = new XMLHttpRequest();' +
                   'xmlHttp.open("GET", "http://localhost:5000/senior-design-test-host/us-central/app/",false);' + //'xmlHttp.open("GET", "https://google.com", false);' +
                   'xmlHttp.send(null);' +
                   'console.log(xmlHttp.requestText);'
                });
        })
        // I'm pretty sure there is a much prettier way of writing the code piece. At the time of writing this I don't have a better way but If I 
        // recall there is a way to just pass a function to the executescript() and it just runs that function and you don't have to deal with all 
        // the escaped strings
};
```
Some things to note. First, in the xmlHttp request you may have to change the url it's trying to access depending on where exactly you host the
app. This is just what mine defaulted to. Second, if you don't see anything being logged from the console log line, thats because extensions have
their own 'background' page. You'll have to open this up by navigating to manage extensions on chrome (click the puzzle piece next to you
extension icon, then manage extensions in the popup), then on the extension click 'inspect views background page'. This should bring up a Chrome
console window and that's where the logging will be located.

With those updates there should be a second button to the extension that sends get requests. This will result in errors if your app is not up an
running, and may still even if it is! I'll be around for any questions or debugging so please ask. 

4. Bonus. if you pull the code from github, you'll see some commented out code in the backgroud.js. That is my attempt at setting the extension up to send a get request everytime a new tab (or page) was opened/visited. I forgot why it broke so if you get to it before I do, please tell me.