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
    B: true, //save
    C: false, //skip
    $other: true,
};

const shouldSaveTheseKeys = [
    'A/Aa',
    'A/Ac/ACa',
    'B',
    'D',
];

const state = {
    A: {
        Aa: { //save the whole tree with key 'A/Aa'
            AAa: 'AAa',
            AAb: 'AAb',
            AAc: {
                AACa: 'AACa',
            }
        },
        Ab: 'Ab', //skip
        Ac: {
            ACa: 'ACa', //save with key 'A/Ac/ACa'
            ACb: 'ACb', //skip
        },
        Ad: 'SAVE ME NOT', //skip because $other === false in configuration object
    },
    B: true, //save with key 'B'
    C: false, //skip
    D: 'SAVE ME', //save with key 'D' because $other === true in config object
};

const newState = {
    A: {
        Aa: {
            AAa: 'new',
            AAb: 'new',
            AAc: {
                AACa: 'new',
            }
        },
        Ab: 'new',
        Ac: {
            ACa: 'new',
            ACb: 'new',
        },
        Ad: 'new',
    },
    B: 'new',
    C: 'new',
    D: 'new',
};


export {persistConfig, state, newState, shouldSaveTheseKeys}