#!/bin/bash

# @author David Durman, 2010

# assuming /www/default folder is created
sudo rm -rf /www/default/*
sudo cp -R client/* /www/default/

./stop.sh

# run static file webserver on top of nodejs
node ./lib/antinode/server.js ./server/settings.json &
# run websocket server
node ./server/server.js &

