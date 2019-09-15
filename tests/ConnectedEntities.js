/**
 *  A test suite for ConnectedEntities class.
 *  @author Paweł Kuźnik <pawel.kuznik@gmail.com>
 */

// the dependecies
const expect            = require('chai').expect;
const ConnectedEntities = require('../index.js').ConnectedEntities;
const Entity            = require('../index.js').Entity;
const ObjectStore       = require('../index.js').ObjectStore;

// helper classes
class A extends Entity { };
class B extends Entity { };

const getStore = () => {

    // construct new store
    const store = new ObjectStore();

    // register A and B classes in the store
    store.register(A, 'a');
    store.register(B, 'b');

    // return the store
    return store;
};

describe('ConnectedEntities', () => {

    describe('.root', () => {

        it('should expose the object store instance if properly initialize entity was passed in constructor', () => {

            // get the object store
            const store = getStore();
            
            // construct A
            const a = store.create(A);

            // construct a collection
            const entities = new ConnectedEntities(a, B);

            // expect object store
            expect(entities.root).to.be.instanceof(ObjectStore);
        });
    });

    describe('.fetch()', () => {

        it('should fetch the previously attached instance', () => {

            // construct A
            const a = new A();

            // construct a collection
            const entities = new ConnectedEntities(a, B);

            // construct new B
            const b = new B();

            // attach b to a
            entities.attach(b);

            // expect we have b
            expect(entities.fetch(b.id)).to.be.equal(b);
        });

        it('should fetch an instance when initialized with ID string', () => {
        
            // get the object store
            const store = getStore();
            
            // construct A
            const a = store.create(A);

            // construct a collection
            const entities = new ConnectedEntities(a, B);

            // create new B instance
            const b = store.create(B);

            // populate collection
            entities.from([ b.id ]);

            // expect we have b
            expect(entities.fetch(b.id)).to.be.equal(b);
        });
    });

    describe('.has()', () => {

        it('should recognize attached entity', () => {

            // create A
            const a = new A();

            // construct a collection
            const entities = new ConnectedEntities(a, B);

            // construct new B
            const b = new B();

            // attach the entity
            entities.attach(b);

            // expect collection to recognize attached entity
            expect(entities.has(b)).to.be.equal(true);
        });

        it('should not recognized not attached entity', () => {

            // construct A
            const a = new A();

            // construct a collection
            const entities = new ConnectedEntities(a, B);

            // construct new B
            const b = new B();

            // expect collection to not recognize this entity
            expect(entities.has(b)).to.be.equal(false);
        });
    });

    describe('.attach()', () => {

        it('should attach an entity to the collection', () => {

            // construct A
            const a = new A();

            // construct a collection
            const entities = new ConnectedEntities(a, B);

            // construct new B
            const b = new B();

            // attach the entity
            entities.attach(b);

            // the collection should be 1 long
            expect(Array.from(entities).length).to.be.equal(1);
        });
    });

    describe('.detach()', () => {

        it('should attach an entity to the collection', () => {

            // construct A
            const a = new A();

            // construct a collection
            const entities = new ConnectedEntities(a, B);

            // construct new B
            const b = new B();

            // attach the entity
            entities.attach(b);

            // and detach the entity
            entities.detach(b);

            // the collection should be empty
            expect(Array.from(entities).length).to.be.equal(0);
        });
    });

    describe('.from()', () => {

        it('should populate the collection from an array of instances', () => {

            // construct A
            const a = new A();

            // construct a collection
            const entities = new ConnectedEntities(a, B);

            // construct new B
            const b1 = new B();
            const b2 = new B();

            // populate the collection
            entities.from([ b1, b2 ]);

            // expect both instances are in the collection
            expect(entities.has(b1)).to.be.equal(true);
            expect(entities.has(b2)).to.be.equal(true);
        });

        it('should populate the collection from an array of strings', () => {

            // get the object store
            const store = getStore();
            
            // construct A
            const a = store.create(A);

            // construct a collection
            const entities = new ConnectedEntities(a, B);

            // create new B instances
            const b1 = store.create(B);
            const b2 = store.create(B);

            // populate collection
            entities.from([ b1.id, b2.id ]);

            // expect both instances are in the collection
            expect(entities.has(b1)).to.be.equal(true);
            expect(entities.has(b2)).to.be.equal(true);
        });
    });

    describe('.create()', () => {

        it('should create a new entity stored in the root', () => {

            // get the object store
            const store = getStore();
            
            // construct A
            const a = store.create(A);

            // construct a collection
            const entities = new ConnectedEntities(a, B);

            // create the entity
            const b = entities.create();

            // expect the entity in the collection
            expect(entities.has(b)).to.be.equal(true);

            // expect the entity to be already stored
            expect(b.isStored).to.be.equal(true);
        });
    });

    describe('.delete()', () => {
    
        it('should remove an entity from the collection', () => {

            // get the object store
            const store = getStore();
            
            // construct A
            const a = store.create(A);

            // construct a collection
            const entities = new ConnectedEntities(a, B);

            // create the entity
            const b = entities.create();

            // remove the entity
            entities.delete(b);

            // expect b to be gone from collection
            expect(entities.has(b)).to.be.equal(false);

            // expect b to not be stored
            expect(b.isStored).to.be.equal(false);
        });

        it('should only remove en entity if it is in the collection', () => {

            // get the object store
            const store = getStore();
            
            // construct A
            const a = store.create(A);

            // construct a collection
            const entities = new ConnectedEntities(a, B);

            // create the entity
            const b = store.create(B);

            // remove the entity
            entities.delete(b);

            // expect b to be gone from collection
            expect(entities.has(b)).to.be.equal(false);

            // expect b to not be stored
            expect(b.isStored).to.be.equal(true);
        });

        it('should throw when removing unsupported entities', done => {

            // get the object store
            const store = getStore();

            // an unsupported class
            const C = class C extends Entity { };
            store.register(C, 'c');
            
            // construct A
            const a = store.create(A);

            // construct a collection
            const entities = new ConnectedEntities(a, B);

            // delete should throw if we pass instance of C
            try {

                // remove the entity
                entities.delete(new C());
            }

            catch(e) {

                // we expect to end up here
                done();
            }
        });
    });

    describe('[Symbol.iterator]', () => {

        it('should allow for iteration', done => {

            // construct A
            const a = new A();

            // construct a collection
            const entities = new ConnectedEntities(a, B);

            // construct new B
            const b = new B();

            // attach the new instance
            entities.attach(b);

            // iterate
            for(let item of entities) {

                // make sure the item is the same
                expect(item).to.equal(b);

                // we can iterate
                done();
            }
        });
    });
});
