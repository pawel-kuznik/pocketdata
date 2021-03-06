/**
 *  This is a kickstart file for the whole library.
 *  @author Pawel Kuznik <pawel.kuznik@gmail.com>
 */

// export the library
module.exports = {
    Entity:             require('./lib/Entity.js').Entity,
    ConnectedEntities:  require('./lib/ConnectedEntities.js'),
    ObjectStore:        require('./lib/ObjectStore.js'),
    Storage:            require('./lib/Storage.js'),
    MemoryStorage:      require('./lib/MemoryStorage.js'),
    LocalWebStorage:    require('./lib/LocalWebStorage.js'),
    SessionWebStorage:  require('./lib/SessionWebStorage.js')
};
