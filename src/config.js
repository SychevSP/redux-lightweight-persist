export let save;
export let load;
export let persistConfig;

//this function sets up configuration for the library
export function  configLib (configObj: {
    asyncSave:(key: string, value: any) => Promise,
    asyncLoad: (key: string) => Promise,
    persistConfig: Any
    }) {
    save = configObj.asyncSave;
    load = configObj.asyncLoad;
    persistConfig = configObj.persistConfig;
}

