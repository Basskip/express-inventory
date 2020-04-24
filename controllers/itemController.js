var Item = require('../models/item')
var Category = require('../models/category')

var async = require('async')

const { body, validationResult } = require('express-validator');

// Display list of all Items
exports.item_list = function (req, res, next) {

  Item.find()
    .exec(function (err, list_items) {
      if (err) { return next(err); }
      res.render('item_list', { title: 'Item List', item_list: list_items });
    })
};
// Display detail page for a specific Item
exports.item_detail = function (req, res, next) {

  Item.findById(req.params.id)
    .populate('category')
    .exec(function (err, item) {
      if (err) { return next(err); }
      if (item == null) {
        var err = new Error('Item not found');
        err.status = 404;
        return next(err);
      } else {
        res.render('item_detail', { title: 'Item Detail', item: item });
      }
    })
};

// Display Item create form on GET
exports.item_create_get = function (req, res, next) {
  Category.find()
    .exec(function (err, category_list) {
      if (err) { return next(err); }
      res.render('item_form', { categories: category_list });
    })
}

// Handle Item create on POST
exports.item_create_post = [
  //Validate
  body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
  body('cost', 'Cost must not be empty.').isLength({ min: 1 }).trim(),
  body('description', 'Description must not be empty').isLength({ min: 1 }).trim(),

  //Sanitize
  body('*').escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var item = new Item(
      {
        name: req.body.name,
        cost: req.body.cost,
        description: req.body.description,
        category: req.body.category
      });

    if (!errors.isEmpty) {
      Category.find()
        .exec(function (err, category_list) {
          if (err) { return next(err); }
          res.render('item_form', { item: item, categories: category_list });
        });
    } else {
      item.save(function (err) {
        if (err) { return next(err); }
        res.redirect(item.url);
      });
    }
  }
];

// Display Item delete form on GET
exports.item_delete_get = function (req, res, next) {
  Item.findById(req.params.id)
    .populate('category')
    .exec(function (err, item) {
      if (err) { return next(err); }
      if (item == null) {
        res.redirect('/item');
      } else {
        res.render('item_delete', { item: item });
      }
    })
}
// Handle Item delete on POST
exports.item_delete_post = function (req, res, next) {
  Item.findByIdAndDelete(req.body.id, (err) => {
    if (err) { return next(err); }
    res.redirect('/item');
  });
};

// Display Item update form on GET
exports.item_update_get = function (req, res, next) {
  async.parallel({
    item: function(callback) {
      Item.findById(req.params.id).exec(callback);
    },
    categories: function(callback) {
      Category.find().exec(callback);
    }
  }, function(err, result) {
    if (err) { return next(err); }
    res.render('item_form', { title: 'Update Item', item: result.item, categories: result.categories });
  })
};

// Handle Item update on POST
exports.item_update_post = [
  //Validate
  body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
  body('cost', 'Cost must not be empty.').isLength({ min: 1 }).trim(),
  body('description', 'Description must not be empty').isLength({ min: 1 }).trim(),

  //Sanitize
  body('*').escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var item = new Item(
      {
        name: req.body.name,
        cost: req.body.cost,
        description: req.body.description,
        category: req.body.category,
        _id: req.params.id
      });

    if (!errors.isEmpty) {
      Category.find()
        .exec(function (err, category_list) {
          if (err) { return next(err); }
          res.render('item_form', { item: item, categories: category_list });
        });
    } else {
      Item.findByIdAndUpdate(req.params.id, item, {}, (err, updateditem) => {
        if (err) { return next(err); }
        res.redirect(updateditem.url);
      })
    }
  }
];