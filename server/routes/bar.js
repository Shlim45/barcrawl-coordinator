const express = require('express');
// const mongoose = require('mongoose');

const Bar = require('../models/Bar');

const router = express.Router();

// GET ALL BARS FROM DB
router.get('/', function(req, res) {
    Bar.find({}, function(err, allBars) {
        if(err) {
            console.log(err);
        } else {
            res.json({ bars: allBars });
        }
    });
});

// id is string of bar in kebab_case
router.get('/:id', function(req, res) {
    const { id } = req.params;
    
    // search by string ID, NOT mongo _id
    Bar.findOne({ id }, function(err, bar) {
        if (err || !bar) {
          console.error({err});
           // bar not found, so create
           Bar.create({id}, function (err, newBar) {
               if (err || !newBar) {
                   return console.error(err.message);
               }
               console.log({newBar});
               res.json(newBar);
           })
        } else {
            console.log({bar});
            res.json(bar);
        }
    });
});

router.put

module.exports = router;