/**
 *  This is a test to check the entity class.
 *  @author Pawel Kuznik <pawel.kuznik@gmail.com>
 */

// get the testing lib
const expect = require('chai').expect;

// get the classes
const Cache         = require('../index.js').Cache;
const Entity        = require('../index.js').Entity;
const ObjectStore   = require('../index.js').ObjectStore;

describe('Cache', () => {

    const A = class extends Entity { };

    const store = new ObjectStore();

    store.register(A);

    let a1 = store.create(A);
    let a2 = store.create(A);

    describe('.load()', () => {

        it('should laod the entities', () => {

            let cache = new Cache(A, store);

            cache.attach(a1);

            let arr = cache.toArray();

            let newCache = new Cache(A, store, arr);

            let one = [...newCache][0];

            expect(one).to.be.equal(a1);
        });
    });
});

