/**
 *  This is a class that can store a number of entities of one class. It can
 *  be serialized to an array of IDs which can be used to recreate the instance
 *  again. This allows serializing a collection of entities within the entity.
 *  In addition the class lazy loads it's items.
 *
 *  @author     Pawel Kuznik <pawel.kuznik@gmail.com>
 */

// the dependencies
const ObjectStore = require('./ObjectStore.js');

// the privates 
const ids       = Symbol('ids');
const entities  = Symbol('entities');
const parent    = Symbol('parent');
const Entity    = Symbol('Entity');

// export the class 
module.exports = class {

    /**
     *  The constructor.
     *  @param  class       A class of the entity to store.
     *  @param  ObjectStore|Entity  Either an object store or an entity that can
     *                      provide with object store.
     *  @param  array       Array of IDs to load into the cache.
     */
    constructor(_Entity, _parent, _ids = []) {

        // the entity of which we need the cache
        this[Entity] = _Entity;

        // the parent thing
        this[parent] = _parent;

        // the ids
        this[ids] =  [..._ids];

        // initialy the entities are 
        this[entities] = null;
    }

    /**
     *  Get the size of the cache.
     *  @return int
     */
    get size() { return this[ids].length; }

    /**
     *  Get access to the root of this cache.
     *  @return ObjectStore
     */
    get root() { return this[parent] instanceof ObjectStore ? this[parent] : this[parent].root; }

    /**
     *  Check if cache is loaded.
     *  @return boolean
     */
    get isLoaded() { return !!this[entities]; }

    /** 
     *  Check if the cache contains an entity.
     *  @param  Entity
     */
    includes(entity) {

        // not of our class? then for sure it's not in the cache
        if (!(entity instanceof this[Entity])) return false;

        // check if the ids include the id
        return this[ids].includes(entity.id);
    }

    /**
     *  Attach a new entity to cache.
     *  @param  Entity
     *  @throws Error   When passed entity is not of class that the cache was created with.
     */
    attach(entity) {

        // if the entity doesn't match the class, then throw
        if (!(entity instanceof this[Entity])) throw Error('Entity class mismatch');

        // push the entity to the ids 
        this[ids].push(entity.id);

        // push entity
        if (this[entities]) this[entities].push(entity);

        // allow chaining
        return this;
    }

    /**
     *  Detach an entity from cache.
     *  @param  Entity
     *  @throws Error   When passed entity is not of class that the cache was created with.
     */
    detach(entity) {

        // if the entity doesn't match the class, then throw
        if (!(entity instanceof this[Entity])) throw Error('Entity class mismatch');

        // get the idx of the entity
        let idx = this[ids].indexOf(entity.id);

        // no need to remove
        if (idx == -1) return this;

        // remove the id
        this[ids].splice(idx, 1);

        // do we have entities loaded?
        if (this[entities]) {

            // get the idx of the entity
            idx = this[entities].indexOf(entity);

            // remove the entity
            if (idx != -1) this[entities].splice(idx, 1);
        }

        // allow chaining
        return this;
    }

    /**
     *  Load entities into cache.
     */
    load() {

        // do we have entities? then there is no point in loading entities
        if (this[entities]) return this;

        // it might be that we don't have a root then don't load
        if (!this.root) return this;

        // load all entities
        this[entities] = this[ids].map(id => this.root.fetch(this[Entity], id)).filter(e => !!e);

        // allow chaining
        return this;
    }

    /**
     *  Clear the cache from any data.
     */
    clear() {

        // reset the arrays
        this[ids].length = 0;
        this[entities].length = 0;

        // allow chaining
        return this;
    }

    /**
     *  Fill the cache with entities.
     */
    fill(entities) {

        // clear the cache before fill
        this.clear();

        // attach all entities
        for(let entity of entities) this.attach(entity);

        // allow chaining
        return this;
    }

    /**
     *  This class is iterable.
     */
    *[Symbol.iterator]() {

        // make sure that the data is loaded
        this.load();

        // yield entities
        for(let entity of this[entities]) yield entity;
    }

    /**
     *  Return an array of IDs of the items in this instance.
     *  @return Array
     */
    toArray() {

        // return the ids
        return [...this].map(e => e.id);
    }
};
