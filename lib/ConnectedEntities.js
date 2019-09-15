/**
 *  Entities can be connected together with a one-many relation. This class
 *  allows for this relation to be created with relative ease.
 *  @author Paweł Kuźnik <pawel.kuznik@gmail.com>
 */

// privates
const entity    = Symbol('entity');
const entities  = Symbol('entities');
const Class     = Symbol('Class');

// expose the class
module.exports = class {

    /**
     *  The constructor.
     *  @param  Entity  The entity that other entities are attached to.
     *  @param  class   The the class of entities that are attached.
     */
    constructor(_entity, _Class) {

        // store the parent entity
        this[entity] = _entity;

        // the class of entities to store in the collection
        this[Class] = _Class;

        // the underlaying collection of entities
        this[entities] = new Map();
    }

    /**
     *  Get access to the root object store
     *  @return ObjectStore
     */
    get root() { return this[entity].root; }

    /**
     *  Fetch entity by ID
     *  @param  string  The ID
     *  @return Entity|undefined    The entity instance of undefined when
     *                              entity couldn't be found.
     */
    fetch(id) {

        // do we have the ID in this collection?
        if (!this[entities].has(id)) return undefined;

        // get the entity
        let entity = this[entities].get(id);

        // is it an instance? then return it
        if (entity) return entity;

        // try to fetch an entity from the root
        entity = this.root.fetch(this[Class], id);

        // no entity? then skip it
        if (!entity) return undefined;

        // remember the entity for future refernce
        this[entities].set(id, entity);

        // return the found entity
        return entity;
    }

    /**
     *  Does the collection contains a target entity?
     *  @param  Entity
     *  @return bool
     */
    has(entity) {

        // if the entity doesn't inherits from given class,
        // then we know for sure it's not contained inside
        // this collection
        if (!(entity instanceof this[Class])) return false;

        // do we have an entity with given ID?
        return this[entities].has(entity.id);
    }

    /**
     *  Attach an entity to the collection.
     *  @param  Entity
     *  @return ConnectedEntities
     */
    attach(entity) {

        // if we already have the entity we don't need to attach more
        if (this.has(entity)) return this;

        // remember the entity
        this[entities].set(entity.id, entity);

        // allow for chaining
        return this;
    }

    /**
     *  Detach an entity from the collection.
     *  @param  Entity
     *  @return ConnectedEntities
     */
    detach(entity) {

        // not in the collection? then chain
        if (!this.has(entity)) return this;

        // remove entity by it's ID
        this[entities].delete(entity.id);

        // allow chaining
        return this;
    }

    /**
     *  Create a new entity inside this list. This method automatically updates
     *  the object store.
     */
    create() {

        // construct an instance
        const instance = this.root.create(this[Class]);

        // attach the instance immediately
        this.attach(instance);

        // return the instance
        return instance;
    }

    /**
     *  Remove the entity. This method also removes the entity from the object
     *  store. The entity is removed from the object store only when it was
     *  stored inside this collection.
     *  @param  Entity  the entity to remove
     *  @throws Error   it throws when trying to remove of a class not supported
     *                  by this collection.
     *  @return ConnectedEntities
     */
    delete(entity) {

        // not an entity we own?
        if (!(entity instanceof this[Class])) throw Error('Entity not supported in collection');

        // not stored in this collection? do nothing
        if (!this.has(entity)) return this;

        // detach the entity
        this.detach(entity);

        // delete the entity
        this.root.delete(entity);

        // allow chaining
        return this;
    }

    /**
     *  Assign new state from an array. This function allows populating collection
     *  with actual entities or an array of IDs. This allows for populating
     *  the collection before all possible entities are available. The input array
     *  can be a mix of instance and ids, only instance or only ids.
     *
     *  @param  Array
     *  @return ConnectedEntities
     */
    from(array) {

        // clear the current collection
        this[entities].clear();

        // add each entity one by one
        for(let entity of array) {

            // if the passed entity is a string we assign an entry, but 
            // set the value to null. Later on it can be evaluated when
            // fetching back the entity.
            if (typeof(entity) == 'string') this[entities].set(entity, null);

            // use regular attach method
            else this.attach(entity);
        }

        // allow chaining
        return this;
    }

    /**
     *  This is a collection and it can be iterable.
     */
    *[Symbol.iterator]() {

        // iterate over the entities
        for(let [key, item] of this[entities]) {

            // are we on non-evaluated entity? then we need to try to fetch it
            if (item == null) {

                // try to fetch an entity from the root
                const entity = this.fetch(key);

                // no entity? then skip it
                if (!entity) continue;

                // yield the fetched entity
                yield entity;
            }

            // yield the item normally
            else yield item;
        }
    }
};
