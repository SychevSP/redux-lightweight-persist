import {save, persistConfig} from './config';

export function createMiddleWare () {
    //check that a function to save to persistent storage is set
    if (!save) {
        throw (`a function to save to persistent storage is not provided
        Please call 'initiateSave' from this library before applying the middleware`);
    }
    //check that the configuration is set
    if (!persistConfig) {
        throw (`a list of entries to persist is not provided
        Please call 'configLib' from this library before calling this function`);
    }
    return middleware;
}

//this middleware saves to persistent storage only those parts of the state that were changed
//the middelware uses persistConfig object to find out which parts to change
const middleware = ({ dispatch, getState }) => {

    return next => action => {

        //save reference to the previous state object
        const prevState = getState();

        //dispatch the action
        const result = next(action);

        //save reference to the updated state object
        const newState = getState();

        //save state only if there were any changes
        //the state is immutable and any change to the state leads to creation of a new object
        if (prevState !== newState) {
            saveEntries(prevState,
                newState,
                persistConfig,
                undefined //first call. No previous key
            );
        }

        //To the next middleware in the chain
        return result;
    };
};

//this function is called recursivly for every level of path in persistConfig object
function saveEntries (prevState, newState, persistConfig, prevPersistentKey) {

    //keys that are explicitly set in persistConfig
    const designatedKeys = Object.keys(newState).filter(key => Boolean(persistConfig[key]));
    //if the $other key in persistConfig is set to true pick all the keys that are not referenced explicitly
    const otherKeys = persistConfig.$other ?
        Object.keys(newState).filter(key => persistConfig[key] === undefined) :
        [];
    //list of all keys that must be checked
    const keys = [...designatedKeys, ...otherKeys];

    //loop through the keys
    keys.forEach(key => {
        //continue only if this branch of the state is changed
        if(prevState[key] === newState[key])  return;
        /*
         * key to save item
         * if we save {a: {b: {c: value}}}
         * the key has a form: a/b/c
         */
        const persistentKey = prevPersistentKey ? prevPersistentKey + '/' + key : key;

        //if there is an object in
        if (typeof persistConfig[key] === 'object') {
            saveEntries (prevState[key], newState[key], persistConfig[key], persistentKey);
            return;
        }

        //save item to persistent storage
        saveItem (persistentKey, newState[key])

    })

}


function saveItem (key, value) {
    try {
        save(key, JSON.stringify(value));
    }
    catch (error) {
        console.log(`Error saving key ${key}`);
        console.log(error);
    }
}