/**
 *  This is a test to check the entity class.
 *  @author Pawel Kuznik <pawel.kuznik@gmail.com>
 */

// get the testing lib
const expect = require('chai').expect;

// get the entity class 
const Entity = require('../index.js').Entity;
const ObjectStore = require('../index.js').ObjectStore;

describe('Entity', () => {

    describe('.constructor()', () => {

        it('should construct an instance without data', () => {

            expect(new Entity).to.be.an('object');
        });
    });

    describe('.id', () => {

        it('should generate with empty data', () => {

            let entity = new Entity();

            expect(entity).to.have.property('id').that.exist;
        });

        it('should assume value from constructor data', () => {

            let entity = new Entity({ id: 'hah' });

            expect(entity).to.have.property('id').that.is.equal('hah');
        });
    });

    describe('.isStored', () => {
    
        it('should be true when the entity was stored', () => {

            class A extends Entity { };

            let os = new ObjectStore();
            os.register(A);

            let a = new A();

            os.store(a);

            expect(a.isStored).to.be.equal(true);
        });

        it('should be false when the entity is not stored', () => {

            let e = new Entity();

            expect(e.isStored).to.be.equal(false);
        });
    });

    describe('toPlainObject()', () => {

        it('should generate a plain object with at least id', () => {

            let entity = new Entity();

            let obj = entity.toPlainObject();

            expect(obj).to.be.an('object');

            expect(obj).to.have.property('id');
        });
    });
});
