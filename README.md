redux-lightweight-persist
=========================

A lightweight library to store selected parts of the state to persistent storage.
Nested paths are supported.
Works with custom load/ save asynchronous functions.

## Usage

First create a configuration object
```js
const persistConfig = {
    A: {
        Aa: true,
        Ab: false,
        Ac: {
            ACa: true,
            ACb: false,
        },
        $other: false,
    },
    B: true,
    C: false,
    $other: true,
};

//With this configuration object the following parts of the state will be saved:
const state = {
    A: {
        Aa: { //save the whole tree with key 'A/Aa'
            AAa: 'AAa',
            AAb: 'AAb',
            AAc: {
                AACa: 'AACa',
            }
        },
        Ab: 'Ab', //skip because A.Ab === false in configuration object
        Ac: {
            ACa: 'ACa', //save with key 'A/Ac/ACa'
            ACb: 'ACb', //skip because A.Ac.ACb === false in configuration object
        },
        Ad: 'SAVE ME NOT', //skip because A.$other === false in configuration object
    },
    B: true, //save with key 'B'
    C: false, //skip because C === false in configuration object
    D: 'SAVE ME', //save with key 'D' because $other === true in configuration object
};

```

Then initiate the library with save and load functions
```js
import {configLib} from 'redux-lightweight-persist';
configLib ({
    asyncSave: MyAsyncSave,
    asyncLoad: MyAsyncLoad,
    persistConfig: persistConfig,
});
```

The functions must conform to protocol:
```js
asyncSave: (key: string, value: any) => Promise,
asyncLoad: (key: string) => Promise,
```
**In asyncLoad promise should return a plain object when resolved.**
If you need to store JSON, please put JSON.stringify / JSON.parse in your asyncSave/ Load function.

Initiate state asynchronously with a function from this library.
Entries specified by the persistConfig object will be read into the state.
You can provide a default state as a fallback if some parts of the state are not present in persistent storage.
```js
import {initiateStateAsync} from 'redux-lightweight-persist';
const initialState = await initiateStateAsync (defaultState);
```

Apply middleware to save changes in state.  
Only those parts that changed will be saved.
```js
import {createPersistMiddleware} from 'redux-lightweight-persist';
const persistMiddleware = createPersistMiddleware();
const store = createStore (reducer, initialState, applyMiddleware(persistMiddleware));
```
