#!/bin/bash

tsc
npm publish


rm ./**/*.d.ts
rm ./**/*.js
rm ./**/*.js.map
