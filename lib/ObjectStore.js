/**
 *  This is a class that allows storing and fetching entity objects. Not all entities
 *  can be stored inside the store, and all objects that can be have to have their
 *  class registered upfront.
 *
 *  @author Pawel Kuznik <pawel.kuznik@gmail.com>
 */

// the dependencies
const MemoryStorage = require('./MemoryStorage.js');
const root = require('./Entity.js').root;

// the symbols for private data
const entities = Symbol('entities');
const data = Symbol('data');
const storage = Symbol('storage');

// export the class
module.exports = class {

    /**
     *  The constructor.
     *
     *  @param  Storage The storage engine used to get/push data to an actual storage
     *                  engine.
     */
    constructor(_storage = null) {

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

        /**
         *  The storage engine.
         *  @var    Storage
         */
        this[storage] = _storage || new MemoryStorage();
    }
 
    /**
     *  Register an entity class under a name. This allows instance of the EntityClass
     *  to be stored and manager by this object store.
     *
     *  @param  Entity  The entity class.
     *  @param  string  The name of the group that the entities should be stored under.
     *                  If nothing provided, then the code will try to use the class name
     *                  as the group.
     *  @return ObjectStore
     */
    register(EntityClass, group) {

        // make sure we have some kind of name to register with
        group = group || EntityClass.name;

        // remember the entity calss under the name
        this[entities].set(EntityClass, group);

        // prepare the set under a group
        this[data].set(EntityClass, new Set());

        // allow chaining
        return this;
    }
    
    /**
     *  Create a new entity and store it inside the object store.
     *
     *  @param  Entity      The registered class of an entity.
     *  @parma  object      The seed data. This is an object that can be passed to the
     *                      entity constructor to seed it with initial data.
     *  @throws This method throws if the entity is not registered with
     *          the object store.
     *  @return Entity      The created entity.
     */
    create(Entity, data) {

        // build up a new entity
        let entity = this.build(Entity, data);

        // store the entity
        this.store(entity);

        // return the entity instance
        return entity;
    };

    /**
     *  Build a new entity instance within this object store. This method doesn't
     *  store the entity within the object store, but it creates a fully functional
     *  class. Since the instance is not yet stored it can be used to prepare the
     *  instance before storing it in the object store.
     *  
     *  To confirm the instance, call .store() method.
     *
     *  @param  Entity      The registered class of an entity.
     *  @parma  object      The seed data. This is an object that can be passed to the
     *                      entity constructor to seed it with initial data.
     *  @throws This method throws if the entity is not registered with
     *          the object store.
     *  @return Entity      The created entity.
     */
    build(Entity, data) {

        // make sure that we store data of entity that we know
        if (!this[entities].has(Entity)) throw new Error('Entity class not registered');
        
        // create the entity
        let entity = new Entity(data);

        // assign the root to the entity
        entity[root] = this;

        // return the entity instance
        return entity;
    }

    /**
     *  Store an entity in the object store. This method also sets the root of
     *  the entity to this object store if the entity has no root.
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

        // set this a root
        if (!entity.root) entity[root] = this;

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
     *  @param  string              The ID of the entity to fetch.
     *  @return Entity|undefined    Returns the entity or undefined when it
     *                              could not be found.
     */
    fetch(EntityClass, id) {

        // the entity class is a string? then we don't have any clue about what
        // could be the entity class. We will need check all possible classes.
        if (typeof(EntityClass) == 'string') {

            // assign the string as id
            id = EntityClass;

            // iterate over all entity classes
            for (let [EntityClass, collection] of this[data]) {

                // try to get an entity
                let entity = this.fetch(EntityClass, id);

                // if we have an entity we can return it
                if (entity) return entity;
            }

            // no entity found
            return undefined;
        } 

        // get one entity of a certain class
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
     *  Get the plain object representation of the ObjectStore class.
     *
     *  @return object
     */
    toPlainObject() {

        // the plain data object
        let plainData = { };

        // iterate over the data
        for(let [label, value] of this[data]) {

            // store the data
            plainData[this[entities].get(label)] = [...value].map(e => e.toPlainObject());
        }

        // return whatever we have in the object
        return plainData;
    }

    /**
     *  Flush the current state of the object store to the local storage.
     *
     *  @return Promise     Return the promise of stored data.
     */
    flush() {

        // push the data to the storage engine
        return this[storage].push(this).then();
    }

    /**
     *  Reload data.
     *
     *  @return Promise     Return the promise of reloaded data.
     */
    reload() {

        // pull the data from the storage engine
        return this[storage].pull(this).then((data) => {

            // iterate over the object and create all entities
            for (let entity in data) {

                // itarate over the registered entities
                for (let [Entity, group] of this[entities]) {

                    // no match? then continue
                    if (group != entity) continue;

                    // convert all data into proper entities
                    data[entity].forEach(eData => { this.store(new Entity(eData)); });
                }
            }
        });
    }
};
