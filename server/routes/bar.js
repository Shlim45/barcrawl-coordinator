const express = require('express');
// const mongoose = require('mongoose');

const Bar = require('../models/Bar');

const router = express.Router();

// GET ALL BARS FROM DB
router.get('/', function(req, res) {
    Bar.find({}, function(err, bars) {
        if(err) { // || !bars
            console.log(err);
        } else {
            res.json({ bars });
        }
    });
});

function getBar(id) {
    // search by string ID, NOT mongo _id
    
    // try using {upsert: true} instead of this shit
    return Bar.findOne({ id }, function(err, bar) {
        if (err || !bar) {
          console.error({err});
           // bar not found, so create
           Bar.create({id}, function (err, newBar) {
               if (err || !newBar) {
                   return console.error(err.message);
               }
               return newBar;
           })
        } else {
            return bar;
        }
    });
}

// GET INFO FROM 1 SPECIFIC BAR
// id is string of bar in kebab_case
router.get('/:id', function(req, res) {
    const { id } = req.params;
    
    const bar = getBar(id);
    res.json(bar);
});

function getUsersFromBar(bar) {
    if (!bar) return;
    console.log('bar:', bar);
}

// ROUTE TO ADD/REMOVE USER GOING TO BAR

router.put('/:id', function(req, res) {
    const barId = req.params.id;
    const { userId } = req.body;
    
    let isGoing;
    
    function updateCallback() {
        res.json({ isGoing });
    }
    
    getBar(barId)
      .then(bar => {
          const {going} = bar; // get array from bar
          // FIX THIS, GOING IS AN ARRAY OF OBJECTS!!
          // going = {when, _id, user}, check against user!
          
          // going = [{user, when}] <-- actual structure
          if (going.includes(userId)) {
              // remove user from list
              console.log('REMOVING FROM LIST', userId, barId);
              isGoing = false;
              Bar.findOneAndUpdate( { id: barId }, { $pullAll: {going: {user: userId} } }, function(err, updatedBar) {
                  if (err || !updatedBar) {
                      console.error(err);
                  } else {
                      console.log(updatedBar);
                  }
              } );
          } else {
              console.log('ADDING TO LIST', userId, barId);
              isGoing = true;
              Bar.findOneAndUpdate( { id: barId }, { $push: {going: {user: userId} } }, function(err, updatedBar) {
                  if (err || !updatedBar) {
                      console.error(err);
                  } else {
                      console.log(updatedBar);
                  }
              } );
          }
      });
});

module.exports = router;