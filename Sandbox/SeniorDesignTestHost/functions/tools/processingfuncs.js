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



// --- My Preference but it won't kill me if y'all disagree ---
// since this is being used by node we need to requrie this API tool specifially because it doesn't come with Node by default.
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;




module.exports = {};