const express = require('express');
const passport = require('../config/ppConfig');
const db = require('../models');
const router = express.Router();
const axios = require('axios');


//GET /favorites - return a page with favorited albums
router.get('/', (req, res) => {
  //ToDo: get all records from DB and render to view
  db.favorite.findAll().then(allFavorites => {
    res.render('favorites', { favorites: allFavorites })
  })
})

//POST /favorites - receive album information and add it to the favorites
router.post('/', function (req, res) {
  //ToDo: Get form data and add it
  db.favorite.findOrCreate({
    where: {
      artist: req.body.artist_name,
      album_title: req.body.album_title,
      userId: req.user.id,
      masterId: req.body.masterId,
    }
  }).then(function (fave) {
    console.log('Created: ', fave.album_title)
    res.redirect('/favorites')
  })
});

//Display more information for each album
router.get('/:id', function(req,res) {
  axios.get(`https://api.discogs.com/masters/${req.params.id}`).then(function(apiResponse) {
      let albumDetails = apiResponse.data
      db.comment.findAll({
        where: { masterId: req.params.id }, 
      }).then(function (comments){
        console.log("these are the comments", comments);
        res.render('album-details', {albumDetails, comments})
      })
      })
})

module.exports = router;