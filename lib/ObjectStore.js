/**
 *  This is a class that allows storing and fetching entity objects. Not all entities
 *  can be stored inside the store, and all objects that can be have to have their
 *  class registered upfront.
 *
 *  @author Pawel Kuznik <pawel.kuznik@gmail.com>
 */

// the symbols for private data
const entities = Symbol('entities');
const data = Symbol('data');
const name = Symbol('name');

// export the class
module.exports = class {

    /**
     *  The constructor.
     */
    constructor(_name) {

        /**
         *  The registered classes.
         *  @var    Map
         */
        this[entities] = new Map();

        /**
         *  A map of the data sets.
         *  @var    Map
         */
        this[data] = new Map();

        this[name] = _name;
    }
 
    /**
     *  Register an entity class under a name. This allows instance of the EntityClass
     *  to be stored and manager by this object store.
     *
     *  @param  Entity  The entity class.
     *  @param  string  The name of the group that the entities should be stored under.
     *  @return ObjectStore
     */
    register(EntityClass, group) {

        // remember the entity calss under the name
        this[entities].set(EntityClass, group);

        // prepare the set under a group
        this[data].set(EntityClass, new Set());

        // allow chaining
        return this;
    }

    /**
     *  Store an entity in the object store.
     *
     *  @param  Entity
     *  @throws This method throws if the entity can't be stored. The entity class needs
     *          to be registered before it can be stored.
     *  @return ObjectStore
     */
    store(entity) {

        // make sure that we store data of entity that we know
        if (!this[entities].has(entity.constructor)) throw new Error('Entity class not registered');

        // store the entity
        this[data].get(entity.constructor).add(entity);

        // allow chaining
        return this;
    }

    /**
     *  Delete an entity from this object store.
     *  
     *  @param  Entity
     *  @throws This method throws if the entity class is not registered yet.
     */
    delete(entity) {

        // make sure that we remove data of entity that we know
        if (!this[entities].has(entity.constructor)) throw new Error('Entity class not registered');

        // store the entity
        this[data].get(entity.constructor).delete(entity);

        // allow chaining
        return this;
    }

    /**
     *  Fetch an entity by id.
     *
     *  @param  string
     */
    fetch(EntityClass, id) {

        // get one entity
        return this.fetchAll(EntityClass).find(e => e.id == id );
    }

    /**
     *  Fetch a collection of entities residing in this object store.
     *
     *  @param Array
     */
    fetchAll(EntityClass) {

        // we don't have the class registered so we can't really fetch anything
        if (!this[entities].has(EntityClass)) return [];

        // try to find an entity that we are looking for
        return [...this[data].get(EntityClass)];
    }

    /**
     *  Flush the current state of the object store to the local storage.
     */
    flush() {

        // the 
        let plainData = { };

        // iterate over the data
        for(let [label, value] of this[data]) {

            // store the data
            plainData[this[entities].get(EntityClass)] = [...value].map(e => e.toPlainObject());
        }

        // set the data in the local storage
        window.localStorage.setItem(this[name], JSON.stringify(plainData));
    }

    /**
     *  Reload data.
     */
    reload() {

        // get the plain data
        let plainData = window.localStorage.getItem(this[name]);
    }
};
