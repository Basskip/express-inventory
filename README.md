# Store Inventory App

A project from [The Odin Project's](https://www.theodinproject.com/lessons/inventory-application) curriculum, creating a small inventory app to practice performing CRUD actions in Express

## Things I learned
* More practice with Express routing/setup
* More practice with express-validator

## Things to work on
* Add authentication/authorization

# Check it out yourself
Download/clone the repository then run using npm

```
git clone git@github.com:Basskip/express-inventory.git
cd express-inventory
npm install
```
At this point you will need to create a .env file and add your MongoDB URI

```
MONGODB_URI = <YOUR MONGODBURI HERE>
```
After that you can run the project with `npm run start` and navigate to localhost:3000 or first populate the database with some starting data by running `node populatedb.js`