/**
 *  This is a base class to define a storage method for the object store. This
 *  class is intended to serve as an interface/base functionality for the actual
 *  implementation.
 *
 *  @author  Paweł Kuźnik <pawel.kuznik@gmail.com>
 */

// export the class
module.exports = class {

    /**
     *  Push data to the object store under a name.
     *
     *  @param  ObjectStore The object store to push.
     *  @return Promise     The promise of the delivered data.
     */
    push(objectStore) {

        // the child class needs to implement this method
        throw Error('Call to unimplemented .push() method');
    }

    /**
     *  Pull data from the object store.
     *
     *  @param  ObjectStore The object store to pull into.
     *  @return Promise     
     */
    pull(objectStore) {

        // the child class needs to implement this method
        throw Error('Call to unimplemented .pull() method');
    }
};
