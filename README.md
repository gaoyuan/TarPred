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

If you cannot clone the repository, ask tjcharlesgao@gmail.com for permission to access.

2. Download the latest version of Nodejs and Mongodb.

3. Setup Mongodb

	mongo

	> use TarPred
	>
	> db.addUser('database_username', 'database_password')

	mongod --dbpath the_path_for_database_storage --auth

4. Make sure the database username and password are consistent with those in server/model/db.js.

5. Install all the node modules: under the server folder, run

	npm install

Start the server
----------------
Under the server folder, run

	npm start

Then your server should be up and running. Have fun!