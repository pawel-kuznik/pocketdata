/**
 *  A test script for ObjectStore class.
 *
 *  @author Pawel Kuznik <pawel.kuznik@gmail.com>
 */

// the testing lib
const expect = require('chai').expect;

// the dependencies
const ObjectStore   = require('../index.js').ObjectStore;
const Entity        = require('../index.js').Entity;

// helper classes
class A extends Entity { };
class B extends Entity { };

describe('ObjectStore', () => {

    describe('.register()', () => {

        it('should register classes', () => {

            // construct a store
            let store = new ObjectStore();

            // register a class 
            store.register(A, 'a').register(B, 'b');
        });
    });

    describe('.build()', () => {

        it('should create a new instance of an Entity class and not store it', () => {

            // create a storage
            let storage = new ObjectStore();
            storage.register(A, 'a');

            // create an object right away
            let a = storage.build(A);

            // check if we have an instance
            expect(a).to.instanceof(A);

            // try to get the object
            let aSecond = storage.fetch(A, a.id);

            // we should not be able to fetch the instance yet
            expect(aSecond).to.be.an('undefined');
        });
    });

    describe('.create()', () => {

        it('should create a new instance of an Entity class and store it', () => {
        
            // create a storage
            let storage = new ObjectStore();
            storage.register(A, 'a');

            // create an object right away
            let a = storage.create(A);

            // try to get the object
            let aSecond = storage.fetch(A, a.id);

            // and make sure that we have the proper object with expected property
            expect(aSecond).to.be.instanceof(A).and.have.property('id').that.equals(a.id);
        });
    });

    describe('.store()', () => {

        it ('should store only registered entities', () => {

            // construct a store
            let store = new ObjectStore();

            // make an instance
            let a = new A();

            // make sure that the instance is not yet there
            expect(store.fetch(a.id)).to.be.an('undefined');

            // we store and it should throw cause the class was never registered
            expect(() => { store.store(a); }).to.throw();

            // register the class
            store.register(A, 'a');

            // we store and it should not throw cause we registred the class 
            expect(() => { store.store(a); }).to.not.throw();

            // and we should get the same instance after the store
            expect(store.fetch(A, a.id)).to.be.equal(a);
        });
    });

    describe('.delete()', () => {

        it('should delete existing entity', () => {

            // prepare store
            let store = new ObjectStore();
            store.register(A, 'a');

            // store a new instance
            let a = new A();
            store.store(a);

            // confirm it's there
            expect(store.fetch(A, a.id)).to.be.an('object');

            // delete it
            store.delete(a);

            // make sure it's gone
            expect(store.fetch(A, a.id)).to.be.an('undefined');
        });

        it('should ignore not stored entities', () => {

            // prepare store
            let store = new ObjectStore();
            store.register(A, 'a');

            // create an instance just to have it
            let a = new A();

            // delete it
            store.delete(a);

            // make sure it's gone
            expect(store.fetch(A, a.id)).to.be.an('undefined');
        });
    });

    describe('.fetch()', () => {

        it('should return undefined for non existing items', () => {

            let store = new ObjectStore();
            let a = new A();

            expect(store.fetch(A, a.id)).to.be.an('undefined');
        });

        it('should return an instance for existing items', () => {

            let store = new ObjectStore();
            let a = new A();
            store.register(A);
            store.store(a);

            expect(store.fetch(A, a.id)).to.equal(a);
        });
    });

    describe('.fetchAll()', () => {

        it('should return an empty array when no entities stored', () => {

            let store = new ObjectStore();
            store.register(A);

            expect(store.fetchAll()).to.be.an('array').and.be.empty;
        });

        it('should return an array when entities are stored', () => {

            let store = new ObjectStore();
            let a = new A();
            store.register(A);
            store.store(a);

            expect(store.fetchAll(A)).to.be.an('array').and.be.not.empty;
        });
    });

    describe('.toPlainObject()', () => {
    
        it ('should create an object when registered entoties', () => {
        
            let store = new ObjectStore();
            store.register(A);
            store.register(B);

            expect(store.toPlainObject()).to.be.an('object');
        });
    });

    describe('.reload()', () => {

        it('should load the data properly', done => {

            let store = new ObjectStore();
            store.register(A);

            let a = store.create(A);

            store.flush();

            store.delete(a);

            store.reload().then(() => {

                let a2 = store.fetch(A, a.id);

                expect(a2).to.have.property('id').that.equals(a.id);

                done();
            });
        });
    });
});
