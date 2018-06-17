import {load, persistConfig} from './config';

export function initiateStateAsync (defaultState) {
    //check that the loader to persistent storage is set
    if (!load) {
        throw (`a loader from persistent storage is not provided
        Please call 'configLib' from this library before calling this function`);
    }
    if (!persistConfig) {
        throw (`a list of entries to persist is not provided
        Please call 'configLib' from this library before calling this function`);
    }

    return retrieveEntries (defaultState, persistConfig);
}

async function retrieveEntries (defaultState, persistConfig, prevPersistentKey) {

    const entriesArray = await Promise.all(Object.keys(defaultState).map(key => {

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
        //if the value is true or if the value is missing but the other key is true
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
    console.log('begin function for key: ', persistentKey);
    let value = null;
    try {
        value = await load(persistentKey);
    }
    catch(error) {
        console.log(`Error loading key ${persistentKey}`);
        console.log(error);
    }
    console.log('await complete for key: ', persistentKey);
    if (value === null) {
        return defaultStateValue;
    } else {
        return JSON.parse(value);
    }
}

