#!/bin/sh

sudo npm -g install typescript

sudo npm -g -D install @types/node
sudo npm -g -D install @types/base32-encoding
sudo npm -g -D install @types/body-parser
sudo npm -g -D install @types/cookie-parser
sudo npm -g -D install @types/copyfiles
sudo npm -g -D install @types/dateformat
sudo npm -g -D install @types/express-session
sudo npm -g -D install @types/express
sudo npm -g -D install @types/formidable
sudo npm -g -D install @types/jsonwebtoken
sudo npm -g -D install @types/node-fetch
sudo npm -g -D install @types/nodemailer
sudo npm -g -D install @types/shelljs
sudo npm -g -D install @types/totp-generator

git clone https://github.com/types/mysql.git
sudo npm -g -D install ./mysql --install-links
sudo rm -r mysql
git clone https://github.com/types/mysql2.git
sed -i 's:"types/mysql":"^2.15.21":g' mysql2/package.json
sudo npm -g -D install ./mysql2 --install-links
sudo rm -r mysql2

sudo npm -g list
node -v
npm -v
tsc -v
