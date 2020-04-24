#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');
require('dotenv').config();

var async = require('async')
var Category = require('./models/category')
var Item = require('./models/item')

var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = [];
var items = [];

function categoryCreate(name, cb) {
  var category = new Category({
    name: name
  });

  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

function itemCreate(name, cost, description, category, cb) {
  var item = new Item({
    name: name,
    cost: cost,
    description: description,
    category: category
  });

  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item);
    cb(null, item);
  });
}

function createCategories(cb) {
  async.series([
    function (callback) {
      categoryCreate('Support', callback);
    },
    function (callback) {
      categoryCreate('Caster', callback);
    },
    function (callback) {
      categoryCreate('Armor', callback);
    },
    function (callback) {
      categoryCreate('Weapons', callback);
    },
    function (callback) {
      categoryCreate('Artifacts', callback);
    }
  ], cb);
}

function createItems(cb) {
  async.series([
    function (callback) {
      itemCreate('Ring of Basilius', 375, 'Ring given as a reward to the greatest mages.', categories[0], callback);
    },
    function (callback) {
      itemCreate('Mekansm', 1875, 'A glowing jewel formed out of assorted parts that somehow fit together perfectly.', categories[0], callback);
    },
    function (callback) {
      itemCreate('Rod of Atos', 2750, 'Atos, the Lord of Blight, has his essence stored in this deceptively simple wand.', categories[1], callback);
    },
    function (callback) {
      itemCreate('Refresher Orb', 5000, 'A powerful artifact created for wizards.', categories[1], callback);
    },
    function (callback) {
      itemCreate('Crimson Guard', 3800, 'A cuirass originally built to protect against the dreaded Year Beast.', categories[2], callback);
    },
    function (callback) {
      itemCreate('Heart of Tarrasque', 5150, "Preserved heart of an extinct monster, it bolsters the bearer's fortitude.", categories[2], callback);
    },
    function (callback) {
      itemCreate('Radiance', 5150, "A divine weapon that causes damage and a bright burning effect that lays waste to nearby enemies.", categories[3], callback);
    },
    function (callback) {
      itemCreate('Shadow Blade', 2800, "The blade of a fallen king, it allows you to move unseen and strike from the shadows.", categories[3], callback);
    },
    function (callback) {
      itemCreate('Maelstrom', 2700, "A hammer forged for the gods themselves, Maelstrom allows its user to harness the power of lightning.", categories[4], callback);
    },
    function (callback) {
      itemCreate('Eye of Skadi', 5500, "Extremely rare artifact, guarded by the azure dragons.", categories[4], callback);
    },
  ], cb)
}



async.series([
  createCategories,
  createItems
],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  });
