const express = require('express');

const Bar = require('../models/Bar');

const router = express.Router();

// GET ALL BARS FROM DB
router.get('/', function(req, res) {
    Bar.find({}, function(err, bars) {
        if(err) { // || !bars
            console.log(err);
            res.json({error: err.message});
        } else {
            res.json({ bars });
        }
    });
});

function getBar(id) {
    // search by string ID, NOT mongo _id
    
    // TODO try using {upsert: true} instead of this shit
    return Bar.findOne({ id }, function(err, bar) {
        if (err) {
            console.error({err});
            return {error: err.message};
        }
        if (!bar) {
           // bar not found, so create
           Bar.create({id}, function (err, newBar) {
                if (err || !newBar) {
                    return {error: err.message};
                }
                    return newBar;
            });
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

// takes going (an array of objects) and returns an 
// array of the usernames going that night only
function getUserIdsGoingToday(goingArray) {
    if (!goingArray || goingArray.length <= 0) return;
    
    const today    = new Date(); // timestamp for LAST NIGHT @ midnight
    const tomorrow = new Date((new Date()).valueOf() + 1000*3600*24); // timestamp of TONIGHT @ MIDNIGHT
    const now      = new Date(Date.now());
    
    
    const tonightTwoAM = (now.getHours() >= 2) 
        ? new Date( // use tomorrow if it is past 2AM
            tomorrow.getFullYear(),
            tomorrow.getMonth(),
            tomorrow.getDate(),
            2,0,0)
        : new Date( // use today if it is from 12 - 2 AM
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            2,0,0);
    
    const usersGoingTonight = goingArray.filter(going => {
        const timeWhenGoing = going.when; // new Date(going.when)
        const twoAM = (timeWhenGoing.getHours() >= 2) 
        ? new Date( // use tomorrow if it is past 2AM
            tomorrow.getFullYear(),
            tomorrow.getMonth(),
            tomorrow.getDate(),
            2,0,0)
        : new Date( // use today if it is from 12 - 2 AM
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            2,0,0);
        
        const isExpired = (twoAM - tonightTwoAM) > 0;
        
        return !isExpired; // return if NOT expired
    });
    
    // return an array of userIds as a string
    return usersGoingTonight.map(user => user.user.toString());
}

// ROUTE TO ADD/REMOVE USER GOING TO BAR

router.put('/:id', function(req, res) {
    const barId = req.params.id;
    const { userId } = req.body;
    
    let isGoing;
    
    getBar(barId)
      .then(bar => {
          const {going} = bar; // get array from bar

          const goingIds = getUserIdsGoingToday(going);

          if (goingIds && goingIds.includes(userId)) {
              // remove user from list
            //   console.log('REMOVING FROM LIST', userId, barId);
              isGoing = false;
              return Bar.findOneAndUpdate( { id: barId }, { $pull: {going: {user: userId} } }, {new: true}, function(err, updatedBar) {
                  if (err || !updatedBar) {
                      console.error(err);
                  }
              } );
          } else {
            // add user to list
            //   console.log('ADDING TO LIST', userId, barId);
              isGoing = true;
              return Bar.findOneAndUpdate( { id: barId }, { $push: {going: {user: userId} } }, {new: true}, function(err, updatedBar) {
                  if (err || !updatedBar) {
                      console.error(err);
                  }
              } );
          }
      })
      .then(bar => res.json({isGoing, bar}));
});

module.exports = router;