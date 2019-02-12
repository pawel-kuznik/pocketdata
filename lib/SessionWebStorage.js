/**
 *  This is a class that describes the implementation of WebStorage class
 *  for sessionStorage.
 *
 *  @author     Paweł Kuźnik <pawel.kuznik@gmail.com>
 */

// dependencies
const WebStorage = require('./WebStorage.js');

// export the class 
module.exports = class extends WebStorage {

    /**
     *  The constructor for the class.
     *  
     *  @param  string  The name of the key that it should use to store the data.
     */
    constructor(name) {
    
        // construct the parent class
        super(name, window.sessionStorage);
    }
};
