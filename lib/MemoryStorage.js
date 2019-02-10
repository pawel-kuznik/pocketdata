/**
 *  This is a class describing a memory storage engine.
 *
 *  @author     Paweł Kuźnik <pawel.kuznik@gmail.com>
 */

// the dependencies
const Storage = require('./Storage.js');

// the data
const data = Symbol('data');

// export the class
module.exports = class extends Storage {

    /**
     *  The constructor.
     */
    constructor() {

        // call parent constructor
        super();
    
        /**
         *  The data that should be stored.
         *  @var    Object
         */
        this[data] = null;
    }
    
    /**
     *  Push data to the storage. Since the data is stored in the memory,
     *  the data push should always be possible and the promise should always
     *  resolve. The actual limit is the limit of data that could be pushed
     *  to the memory, but at this point it's already a problem and it can
     *  be an issue to even pass the data via parameter.
     *
     *  @param  ObjectStore     The object store to push to the storage.
     *  @return Promise         The promise of stored data.
     */
    push(objectStore) {

        // return a new promise like the docs of the base class tell us to do
        return new Promise((resolve, reject) => {

            // tell the object store to provide us with a plain object to store
            this[data] = objectStore.toPlainObject();

            // resolve the promise
            resolve();
        });
    }

    /**
     *  Pull data to the object store. Since the data is stored in the memory,
     *  the data push should always be possible and the promise should always
     *  resolve.
     *
     *  @param  ObjectStore     The object store to pull the data for.
     *  @return Promise         The promise of data for the object store.
     */
    pull(objectStore) {

        // return a new promise like the docs of the base class tell us to do
        return new Promise((resolve, reject) => {

            // resolve the promise with current data
            resolve(this[data] || { });
        });
    }
};
