#!/bin/bash

tsc
npm publish --access public


rm ./**/*.d.ts
rm ./**/*.js
rm ./**/*.js.map
