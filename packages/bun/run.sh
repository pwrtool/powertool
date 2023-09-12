#!/bin/bash

if [ -z "$1" ]
then
    echo "Please input the file name"
    exit
fi

tsc
node $1.js $2 $3 $4 $5 $6 $7 $8 $9

rm *.js
rm *.d.ts
rm *.js.map
rm ./**/*.d.ts
rm ./**/*.js
rm ./**/*.js.map