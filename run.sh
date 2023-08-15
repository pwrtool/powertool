#!/bin/bash

if [ -z "$1" ]
then
    echo "Please input the file name"
    exit
fi

tsc
node $1.js

rm *.js
rm *.js.map
rm ./**/*.js
rm ./**/*.js.map