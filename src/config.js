export let save;
export let load;
export let persistConfig;

export function  configLib (configObj: {
    asyncSave:(key: string, value: any) => Promise,
    asyncLoad: (key: string) => Promise,
    persistConfig: Any
    }) {
    save = configObj.asyncSave;
    load = configObj.asyncLoad;
    persistConfig = configObj.persistConfig;
}

/*
 export function initiateSave (asyncSave: (key: string, value: any) => Promise) {
 save = asyncSave;
 }

 export function initiateLoad (asyncLoad: (key: string) => Promise) {
 load = asyncLoad;
 }
 */