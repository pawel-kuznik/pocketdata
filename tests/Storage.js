/**
 *  This is a test file for the storage class.
 *
 *  @author     Paweł Kuźnik <pawel.kuznik@gmail.com>
 */

// testing lib
const expect = require('chai').expect;

// get the storage class
const Storage = require('../index.js').Storage;

// tell that we are testing a storage class
describe('Storage', () => {

    describe('.push()', () => {
        it('should throw if the .push() method is not implemented', () => {
        
            // construct the storage
            let storage = new Storage();

            // in the base class the storage is never implemented
            expect(() => { storage.push(); }).to.throw();
        });
    });

    describe('.pull()', () => {
        it('should throw if the .pull() method is not implemented', () => {
        
            // construct the storage
            let storage = new Storage();

            // in the base class the storage is never implemented
            expect(() => { storage.pull(); }).to.throw();
        });
    });
});
