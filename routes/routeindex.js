const { render } = require('ejs');
const express = require('express');
const router = express.Router();


router.get('/', async function(req,res){
  res.render('crearTicket', {})
});

router.get('/login', async function(req,res){
  res.render('login', {})
});

router.post('/login', async function(req,res){
  res.redirect('/')
});

router.get('/register', async function(req,res){
  res.render('register', {})
});

router.get('/crearTicket', async function(req,res){
  res.render('crearTicket', {})
});

router.get('/departments', async function(req,res){
  res.render('departments', {})
});

router.get('/users', async function(req,res){
  res.render('users', {})
});

router.get('/editUser', async function(req,res){
  res.render('editUser', {})
});

router.get('/editTicket', async function(req,res){
  res.render('editTicket', {})
});

router.post('/editTicket', async function(req,res){
  res.redirect('/')
});

router.get('/misTickets', async function(req,res){
  res.render('misTickets', {})
});

router.get('/viewTicket', async function(req,res){
  res.render('viewTicket', {})
});

router.post('/updateStatus', async function(req,res){
  res.redirect('/viewTickets')
});

router.get('/viewTickets', async function(req,res){
  res.render('viewTickets', {})
});

module.exports = router;