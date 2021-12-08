import Entity from "../lib/Entity";

describe('Entity', () => {

    describe('.id', () => {

        test('id is assigned from a constructor', () => {

            const entity = new Entity({ id: 'test' });

            expect(entity.id).toEqual('test');
        });

        test('id is generated when not passed in the constructor', () => {

            const entity = new Entity({ });

            expect(entity.id).toBe('string');
            expect(entity.id.length).toBeGreaterThan(0);
        });
    });

    describe('.isStored', () => {

        test('that it is false when no id was passed', () => {

            const entity = new Entity();

            expect(entity.isStored).toBeFalsy;
        });

        test('that it is true when ud was passed in the constructor', () => {

            const entity = new Entity({ id: 'test' });

            expect(entity.isStored).toBeTruthy;
        });

        test('that it can be fetched when it is true', () => {

            const entity1 = new Entity({ id: 'test '});
            const entity2 = Entity.storageIndex.fetch('test');

            expect(entity1).toEqual(entity2);
        })

        test('that it can not be finished when id was not passed', () => {

            const entity1 = new Entity({ });
            const entity2 = Entity.storageIndex.fetch(entity1.id);

            expect(entity2).toEqual(null);
        });
    });

    describe('.data', () => {

        test('it passes the data passed in the constructor', () => {

        });
    });
});