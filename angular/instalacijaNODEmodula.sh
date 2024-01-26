#!/bin/sh

curl -fsSL https://deb.nodesource.com/setup_17.x | sudo -E bash - && sudo apt-get install -y nodejs

sudo npm -g install base32-encoding
sudo npm -g install body-parser
sudo npm -g install cookie-parser
sudo npm -g install corepack
sudo npm -g install copyfiles
sudo npm -g install dateformat
sudo npm -g install express-session
sudo npm -g install express
sudo npm -g install formidable
sudo npm -g install jsonwebtoken
sudo npm -g install mysql2
sudo npm -g install node-fetch
sudo npm -g install nodemailer
sudo npm -g install shelljs
sudo npm -g install totp-generator

sudo npm -g update
sudo npm -g list
node -v
npm -v
