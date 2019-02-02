/**
 *  This is a class that allows storing and fetching entity objects. Not all entities
 *  can be stored inside the store, and all objects that can be have to have their
 *  class registered upfront.
 *
 *  @author Pawel Kuznik <pawel.kuznik@gmail.com>
 */

// export the class
module.exports = class {

    /**
     *  Register an entity class under a name. This allows instance of the EntityClass
     *  to be stored and manager by this object store.
     *
     *  @param  Entity  The entity class.
     *  @param  string  The name of the group that the entities should be stored under.
     *  @return ObjectStore
     */
    register(EntityClass, group) {
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

    }

    /**
     *  Delete an entity from this object store.
     *  
     *  @param  Entity
     *  @throws This method throws if the entity class is not registered yet.
     */
    delete(entity) {
    }

    /**
     *  Fetch an entity by id.
     *
     *  @param  string
     */
    fetch(id) {
    }

    /**
     *  Fetch a collection of entities residing in this object store.
     *
     *  @param  string  the group name of the entities to fetch.
     */
    fetchAll(group = null) {
    }
};
