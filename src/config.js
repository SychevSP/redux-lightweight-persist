export let save;
export let load;
export let persistConfig;

//this function sets up configuration for the library
export function  configLib ({ asyncSave, asyncLoad, persistConfig: config}) {
    save = asyncSave;
    load = asyncLoad;
    persistConfig = config;
}

