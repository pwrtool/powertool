#!/bin/bash

# This script is used to build and install your kit. By default, it just moves the exported index.cjs file to the kit directory, however you may want to have it move some extra files as well.
cd "$(dirname "$0")"
INSTALL_DIR=$1

# ensure that the install directory exists
mkdir -p $INSTALL_DIR

# Rollup based on your rollup.config.js file it should export an index.cjs file
echo "Building kit..."
rollup -c


# copy the index.cjs file to the install directory
echo "Installing kit..."
cp index.cjs $INSTALL_DIR/index.js

