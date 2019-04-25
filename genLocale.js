#!/usr/bin/env node
let stdin = process.stdin;
let input = "";
stdin.on('data', (line) => input +=line);
stdin.on('end', () => {
    let dataArray = JSON.parse(input);
    console.log(JSON.stringify(makeLocale(dataArray), null, 2));
});

function makeLocale(dataArray) {
    let locale = {};
    dataArray.forEach((entry) => {
        locale[entry.name] = entry;
        delete locale[entry.name].name;
    });
    return locale
}


