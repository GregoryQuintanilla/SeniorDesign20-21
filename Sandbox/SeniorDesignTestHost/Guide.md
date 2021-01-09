# Guide to Firebase Hosting
## Before we Get Started
- I **highly** recommend you follow atleast this youtube video. https://www.youtube.com/watch?v=LOeioOKUKI8. I watched atleast up to the 6:50 mark 
before I went off on my own to see what I could manage to create. If you watch the whole thing and there is some good stuff in it please share.
- You will need node packet manager (npm) and NodeJS install on your machine. https://www.npmjs.com/get-npm
- There will be some fuzzyiness when it comes to connecting your project on the machine to the one on the firebase dashboard and honestly don't 
know exactly what the solution will be just yet. I remember I had to play around with it a bit and I am also the 'owner' of the dashboard so I 
don't know if it'll look different for y'all. I think you would just need to do 'firebase login *your cerdentials*'. But like I said I don't know what it looks like for editors to other peoples projects. 
 

Once you have follwoed through the video you should have most of the components in place to add a little bit more to connect some things up.

- Once this  lets add code to the index.js loacted in the functions folder if you didn't just pull from the github. **FULL DISCLOSURE** This is
going to be quite a cluster. I remember I had to change the location of the public folder at some point because of connecting to the dashboard. If
this comes up ask me and again I'll be on standby.

```
app.get('/',(request, response) =>{
    // This is a fun important piece. Since we are the owners of the server we can do whatever the hell we want and accept request from whatever hosts. I reccommend
    // being atleast familiar with what Cross Origin Resource Sharing (CORS) is and the "idea" behind it. It is a pain in the neck for devs because it is enforced by
    // most browsers. 
    
    //this just sends the page back to whoever requested it.
    response.set('Access-Control-Allow-Origin', '*');
    response.sendFile('public/index.html',{root: __dirname});

    //now that we can have the browser talk to the server (!!!) this is where just straight dev comes in. Time to play around
});

/* 
// before uncommenting this out make sure the code on your machine is properly associated with the project on the firebase dashboard. If it is not
// then there will be no database connected.
app.get('/addToDB', (request,response) => {
    testDocRef.set({
        name: 'greg',
        age: 22,
    });
    response.send('Added data to the db hopefully');
});
*/
```
- If everything is set up correctly you should be able to navigate to whatever folder your project is you can run the command 'firebase serve' and it should take care of everything.

- Once this code is all in place you should be able to just visit the URLs in your browser (https://localhost:#####/) and it should come up. After 
a node app is really just a dynamic webpage, we just aren't using it for that exact purpose. Play around with making you own routes just so you get
the hang of its form. This page can help with understanding NodeJS express routing: https://expressjs.com/en/guide/routing.html 

- If you also have the extension set up you can play around with connecting the two. Make sure the NodeJS is running and click the button and see 
what happens. From here if everything is working you're ready to develop stuff. 

- I do apologise if this Guide is less helpful because everything is a bit fuzzy from when I did this and I did a poor job at documenting what 
exactly it is I did.