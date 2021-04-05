let changeColor = document.getElementById('changeColor');
let getReq = document.getElementById('getReq');
// this is used so we have access to the background page of the chrome. 
// bkg.console.log() will be sent to that page and that is one way to debug things and see fi stuff is formatted correctly.
var bkg = chrome.extension.getBackgroundPage();

// chrome.storage.sync.get('color', function(data) {
//     changeColor.style.backgroundColor = data.color;
//     changeColor.setAttribute('value', data.color);
// })
// https://google.com works. Defaults as POST for some reason but whatevs.
// need to figure out why it can't load localhost:5000 or 127.0.0.1:5000. Next step.
getReq.onclick = function(element) {
    bkg.console.log("Is this doing anything????");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'var xmlHttp = new XMLHttpRequest();' +
                   'xmlHttp.open("GET", "http://localhost:5000/senior-design-test-host/us-central/app/",false);' + //'xmlHttp.open("GET", "https://google.com", false);' +
                   'xmlHttp.send(null);' +
                   'console.log(xmlHttp.requestText);'
                });
            //{code: 'console.log(\''+element.target.value+'\');'});
        })
};


changeColor.onclick = function(element) {
    let color = element.target.value;
    bkg.console.log("Is this doing anything????");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'document.body.style.backgroundColor = "' + color + '";'});
    });
};


