redux-lightweight-persist
=========================

A lightweight library to store selected parts of the state to persistent storage. Nested paths are supported. Accepts any save load function that confirms to protocol

## Usage

First create a configuration object
```js
export const persistConfig = {
    A: {
        Aa: true, //save
        Ab: false, //skip
        Ac: {
            ACa: true, //save
            ACb: false, //skip
        },
        $other: false,
        Ad: 'SAVE ME NOT', //skip because $other === false
    },
    B: true, //save 3
    C: false, //skip
    $other: true,
    D: 'SAVE ME', //save because $other === true
};

//for entries saved in total
```

Then initiate the library with save and load functions
```js
import configLib from 'redux-lightweight-persist';
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

