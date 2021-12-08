import Index from "./Index";

/**
 *  The actual entity data. This object holds data associated with an entity.
 *  However, it only holds "local" entity data. 
 */
export interface EntityData {

    // we have to have an id inside the actual entity data
    id:string;

    // any kind of keys are welcome inside initial data
    [key:string]:any;
};

/**
 *  The entity class 
 */
export default class Entity<DataType extends EntityData = EntityData> {

    /**
     *  Get access to the storage root. This is the root of the actual storage branch.
     */
    static get storageRoot() : Root { return null; }

    /**
     *  Get access to the storage index of this class. Storage indices are objects
     *  presenting a series of entities stored under same key. This might be entities
     *  of the same class, but it might also be mixed collection of different classes.
     * 
     *  @todo should an entity be only inside one index? should we have entities stored
     *  in many indices?
     */
    static get storageIndex() : Index { return null; }

    /**
     *  The current entity data.
     */
    private _data:DataType;

    /**
     *  The constructor.
     */
    constructor(data:DataType & { id?:string }) {

        this._data = Object.assign({ }, data, {
            id: data.id ? data.id : 'dummy'
        });
    }

    /**
     *  Get access to the entity data.
     */
    get data() : DataType { return this._data; }
}