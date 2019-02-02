/**
 *  This is a base for all entities.
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

        // ensure that the property is there
        if (!this[data].name) this[data].name = null;
    }

    /**
     *  Return the id of the entity.
     *  @return     string
     */
    get id() {
        return this[data].id;
    }

    /**
     *  Return the name of the entity.
     *  @return     string
     */
    get name() {

        // return the name
        return this[data].name;
    }

    /**
     *  Set a new name value.
     *  @param      string
     */
    set name(newValue) {
        this[data].name = newValue;
    }

    /**
     *  Get a plain object representation of the entity.
     *  @return Object
     */
    toPlainObject() {

        // return the object
        return {
            id:             this.id,
            name:           this.name,
            commonName:     this.commonName
        };
    }
};
