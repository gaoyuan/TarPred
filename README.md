TarPred
=======
Target Prediction Using 3NN Fusion

Dependencies
------------
1. [Node.js](http://nodejs.org/)

2. [mongodb](http://mongodb.org/)

Setup
------------
1. Clone the repository

	git clone git@github.com:gaoyuan/TarPred.git 

2. Download the latest version of Nodejs and Mongodb.

3. Setup Mongodb

	mongo

	> use TarPred
	> db.addUser('database_username', 'database_password')

	mongod --dbpath the_path_for_database_storage --auth

4. Install all the node modules. Under the server folder, run

	npm install

Start the server
----------------
Under the server folder, run

	npm start

Then your server should be up and running. Have fun!