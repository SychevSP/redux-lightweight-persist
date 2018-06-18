export const testConfig = {
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
