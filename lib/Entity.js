/**
 *  This is a class that describes an entity that can be stored inside
 *  the object store. To use this class that client code needs to extend
 *  it.
 *
 *  @author     Pawel Kuznik <pawel.kuznik@gmail.com>
 */

// the dependencies
const uuid = require('uuid/v4');

// the privates
const data = Symbol('data');

// export the class
module.exports = class {

    /**
     *  Construct the class
     */
    constructor(_data = { }) {

        /**
         *  The data of the template.
         *  @var    Object
         */
        this[data] = _data;

        // generate the id of the entity if it's not there
        if (!this[data].id) this[data].id = uuid();
    }

    /**
     *  Return the id of the entity.
     *  @return     string
     */
    get id() {
        return this[data].id;
    }

    /**
     *  Get a plain object representation of the entity.
     *  @return Object
     */
    toPlainObject() {

        // return the object
        return {
            id: this.id
        };
    }
};
