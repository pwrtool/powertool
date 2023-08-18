#!/bin/bash

tsc
npm publish


rm *.js
rm *.d.ts
rm *.js.map
rm ./**/*.d.ts
rm ./**/*.js
rm ./**/*.js.map
