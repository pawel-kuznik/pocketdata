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
const root = Symbol('root');
const data = Symbol('data');

// define the class 
const Entity = class {

    /**
     *  Construct the class
     *
     *  @param  object      The object data of the entity. This is suppose to
     *                      be the object from the .toPlainObject() method.
     *  @param  ObjectStore The Object store instance that the entity came from.
     *                      In case of new entities it might be that no root
     *                      is provided.
     */
    constructor(_data = { }, _root = null) {

        /**
         *  The root of the entity.
         *  @var    ObjectStore
         */
        this[root] = _root;

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
     *  Get access to the root instance.
     *  @return ObjectStore
     */
    get root() {
        return this[root];
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

// export the class and the symbol to control the root
module.exports = {
    Entity: Entity,
    root:   root
};
