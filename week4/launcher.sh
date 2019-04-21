fuser -k 3000/tcp

service redis_6370 start
cd ./new-oj-server
npm install
nodemon server.js &
cd ../executor
pip install -r requirement.txt
python executor_server.py &
cd ../new-oj-client
npm install
ng build --watch


echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
read -p "PRESS [ENTER] TO TERMINATE PROCESSES." PRESSKEY

fuser -k 3000/tcp
fuser -k 5000/tcp
service redis_6370 stop
