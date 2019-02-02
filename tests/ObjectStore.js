/**
 *  A test script for ObjectStore class.
 *
 *  @author Pawel Kuznik <pawel.kuznik@gmail.com>
 */

// the testing lib
const expect = require('chai').expect;

// the dependencies
const ObjectStore = require('../lib/ObjectStore.js');
const Entity = require('../lib/Entity.js');

// helper classes
class A extends Entity { };
class B extends Entity { };

describe('ObjectStore', () => {

    describe('.register()', () => {

        it('should register classes', () => {

            let store = new ObjectStore();

            store.register(A, 'a').register(B, 'b');
        });
    });

    describe('.store', () => {

        it ('should store only registered entities', () => {

            let store = new ObjectStore();

            let a = new A();

            expect(() => { store.store(a); }).to.throw();

            store.register(A, 'a');

            expect(() => { store.store(a); }).to.not.throw();
        });
    });
});
