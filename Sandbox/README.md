# Skeleton Project
This is a running Sandbox development of the ideas of our system. This current Sandbox project has:
- A Firebase Project using Firebase Hosting
- A working Firebase Hosting of a NodeJS Express app
- A NodeJS app
- A Basic Chrome Extension
- a Cloude Firestore attached to the working Firebase Project

## Firebase
- Firebase hosting is used via command line to host the project. This skeleton is run on local host and is not pushed to the cloud.
- Cloud Firestore is used for right now. Some research and playing around with their client database may be in order to choose which suits our project the best.

## Chrome Extension
- Very basic
- 1 button that changes google developer pages green
- 1 that sends a request to the node app.

## NodeJS Express App
This app code is located in the SeniorDesignTestHost/functions/index.js
- has a root page
- has a basic timestamp page found in the firebase tutorial video found in the ~/Tools/Firebase
- has a basic get request.
- has a function to add data to the attached cloud Firestore