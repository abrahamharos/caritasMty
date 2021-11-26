const { render } = require('ejs');
const express = require('express');
const router = express.Router();


router.get('/', async function(req,res){
  res.render('index', {})
});

router.get('/login', async function(req,res){
  res.render('login', {})
});

router.get('/register', async function(req,res){
  res.render('register', {})
});

module.exports = router;