#!/bin/bash

tsc
npm publish


rm *.js
rm *.js.map
rm ./**/*.js
rm ./**/*.js.map
