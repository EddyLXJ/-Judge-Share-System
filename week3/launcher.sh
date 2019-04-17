fuser -k 3000/tcp

service redis_6370 start
cd ./new-oj-server
npm install
nodemon server.js &
cd ../new-oj-client
npm install
ng build --watch

echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
read -p "PRESS [ENTER] TO TERMINATE PROCESSES." PRESSKEY

fuser -k 3000/tcp
service redis_6370 stop