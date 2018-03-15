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

// takes going (an array of objects) and returns an array of the 
// usernames going that night only
function getUserIdsGoingToday(goingArray) {
    if (!goingArray || goingArray.length <= 0) return;
    
    const today    = new Date(); // timestamp for LAST NIGHT @ midnight
    const tomorrow = new Date((new Date()).valueOf() + 1000*3600*24); // timestamp of TONIGHT @ MIDNIGHT
    const oneDay   = 24 * 60 * 60 * 1000; //  * 1000
    const now      = new Date(Date.now());
    
    // console.log(Date.parse(today), '\n', Date.parse(tomorrow), {oneDay});
    // console.log({now: Date.parse(now)});
    
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
            
        // console.log('TEST:', (twoAM - tonightTwoAM));
            
        // console.log('when:', Date.parse(timeWhenGoing));
        // console.log('2am:', Date.parse(twoAM));
        // console.log(twoAM - timeWhenGoing);
        // console.log((twoAM - timeWhenGoing) < oneDay);
        
        const within24hours = (now - timeWhenGoing) < oneDay;
        
        // console.log({within24hours});
        
        const isExpired = (twoAM - tonightTwoAM) > 0;
        
        // return (within24hours && twoAM - timeWhenGoing < oneDay);
        return !isExpired; // return if NOT expired
    });
    
    // console.log({usersGoingTonight});
    
    return usersGoingTonight.map(user => user.user.toString());
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
          const goingIds = getUserIdsGoingToday(going);
          
          console.log({userId, goingIds});
        //   console.log(goingIds.includes(userId));
          // going = [{user, when}] <-- actual structure
          if (goingIds && goingIds.includes(userId)) {
              // remove user from list
              console.log('REMOVING FROM LIST', userId, barId);
              isGoing = false;
              Bar.findOneAndUpdate( { id: barId }, { $pull: {going: {user: userId} } }, function(err, updatedBar) {
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