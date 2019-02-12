/**
 *  This is a class imeplementing a storage engine using WebStorage API.
 *
 *  @author     Paweł Kuźnik <pawel.kuznik@gmail.com>
 */

// dependencies
const Storage = require('./Storage.js');

// privates
const name = Symbol('name');
const engine = Symbol('engine');

// export the class
module.exports = class extends Storage {

    /**
     *  The constructor for this class.
     *
     *  @param  string      The name of the key that it should use to store
     *                      the data.
     *  @param  WebStorageAPI.Storage   An instance of web storage API capable
     *                                  of handling the data. In reality it would
     *                                  be either LocalStorage or SessionStorage
     */
    constructor(_name, _engine) {

        /**
         *  The engine instance that should store the data.
         *  @var    Storage
         */ 
        this[engine] = _engine;

        /**
         *  The name of the key to use.
         *  @var    string 
         */
        this[name] = _name;
    }

    /**
     *  Push data to the object store under a name.
     *
     *  @param  ObjectStore The object store to push.
     *  @return Promise     The promise of the delivered data.
     */
    push(objectStore) {

        // return a new promise
        return new Promise((resolve, reject) => {

            // cast the object store to a plain object
            let plainData = objectStore.toPlainObject();

            // store the data in the web storage
            this[engine].setItem(this[name], JSON.stringify(plainData));

            // resolve the promise
            resolve();
        });
    }

    /**
     *  Pull data from the object store.
     *
     *  @param  ObjectStore The object store to pull into.
     *  @return Promise     
     */
    pull(objectStore) {

        // return a new promise
        return new Promise((resolve, reject) => {

            // try to get data
            let data = this[engine].getItem(this[name]);

            // if we have data we need to parse the data before we pass it
            resolve(data ? JSON.parse(data) : { });
        });
    }
};
