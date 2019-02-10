/**
 *  A test script to check if the Memory storage works property.
 *
 *  @author     Paweł Kuźnik <pawel.kuznik@gmail.com>
 */

// testing libray
const expect = require('chai').expect;

// the class to test
const MemoryStorage = require('../index.js').MemoryStorage;
const ObjectStore = require('../index.js').ObjectStore;

// tell that we are testing the memory storage.
describe('MemoryStorage', () => {

    // test .push method
    describe('.push()', () => {

        it('should return a promise', () => {

            // construct objects
            let storage = new MemoryStorage();
            let objectStore = new ObjectStore(storage);
        
            // expect the result of push to be a promise
            expect(storage.push(objectStore)).to.be.a('promise');
        });

        it('should always resolve for trivial data', (done) => {

            // construct objects
            let storage = new MemoryStorage();
            let objectStore = new ObjectStore(storage);

            // push the data
            storage.push(objectStore).then(done);
        });

        it('should store the data', (done) => {

            // construct objects
            let storage = new MemoryStorage();
            let objectStore = new ObjectStore(storage);

            // push the data
            storage.push(objectStore).then(() => {

                // try to get the data
                storage.pull(objectStore).then(data => {

                    // make sure that the data is the same
                    expect(data).to.be.an('object');

                    // done
                    done();
                });
            });
        });
    });

    // test .pull method
    describe('.pull()', () => {

        it('should always return a promise', () => {
        
             // construct objects
            let storage = new MemoryStorage();
            let objectStore = new ObjectStore(storage);
        
            // expect the result of pull to be a promise
            expect(storage.pull(objectStore)).to.be.a('promise');
        });

        it('should always resolve for trivial data', (done) => {

            // construct objects
            let storage = new MemoryStorage();
            let objectStore = new ObjectStore(storage);

            // pull the data
            storage.pull(objectStore).then(() => {

                done();
            });
        });
    });
});
