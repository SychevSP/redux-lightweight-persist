import {load, persistConfig} from './config';

export function initiateStateAsync (defaultState) {
    //check that the loader to persistent storage is set
    if (!load) {
        throw (`a loader from persistent storage is not provided
        Please call 'configLib' from this library before calling this function`);
    }
    //check that the configuration is set
    if (!persistConfig) {
        throw (`a list of entries to persist is not provided
        Please call 'configLib' from this library before calling this function`);
    }

    return retrieveEntries (defaultState, persistConfig);
}

//this function checks persistConfig object to find which keys to retrieve
//if there is no data in persistent storage saved for the key, the function will initiate the key with default value provided in the default state
async function retrieveEntries (defaultState, persistConfig, prevPersistentKey) {

    const entriesArray = await Promise.all(Object.keys(defaultState).map(key => {

        //add current key to the key string
        const persistentKey = prevPersistentKey ? prevPersistentKey + '/' + key : key;
        const defaultStateValue = defaultState[key];

        //call recursively if the key has subentries
        if (typeof persistConfig[key] === 'object') {
            return retrieveEntries (
                defaultStateValue,
                persistConfig[key],
                persistentKey
            ).then(value => ({[key]: value}));
        }
        //if the key is explicitly set to true in persistConfig object
        // or if the special key $other is set to true
        //retrieve item from persistent storage
        if(persistConfig[key] === true || (persistConfig[key] === undefined && persistConfig.$other)) {
            return setInitialStateValue(persistentKey, defaultStateValue).then(value => ({[key]: value}));
        }
        //do not retrieve anything
        return null;
    }));

    //the state is an object
    //so we need to turn array into object
    return entriesArray.reduce((acc, e) => {return {...acc, ...e}});

}


async function setInitialStateValue (persistentKey, defaultStateValue) {
    let value = null;
    try {
        value = await load(persistentKey);
    }
    catch(error) {
        console.log(`Error loading key ${persistentKey}`);
        console.log(error);
    }
    return value ? value : defaultStateValue;
}

