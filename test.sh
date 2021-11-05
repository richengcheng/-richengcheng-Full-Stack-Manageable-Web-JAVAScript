#!/usr/bin/env bash

#!set -e
echo hello
mkdir -p screenshots
mkdir -p trace
#! rm -rf *.db
# [ ! -d "node_modules" ] && echo "INSTALLING MODULES" && npm install
node index.js&
node_modules/.bin/jest --runInBand --detectOpenHandles acceptance\ tests/*
read -p "Press enter to continue"
kill $(lsof -t -i:8080)

# if you are running on unix and the node process is not being destroyed by the kill %1 command above then you can try:
#pkill node