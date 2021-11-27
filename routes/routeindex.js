const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const { sequelize, Ticket } = require('../db')

// EDUARDO
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

router.get('/departments', async function(req,res){
  res.render('departments', {})
});

router.get('/users', async function(req,res){
  res.render('users', {})
});

router.get('/editUser', async function(req,res){
  res.render('editUser', {})
});

// Mau 
router.get('/crearTicket', async function(req,res){
  res.render('crearTicket', {})
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

router.post('/updateStatus', async function(req,res){
  res.redirect('/viewTickets')
});

// Shaar
router.get('/viewTicket', async function(req,res){
  res.render('viewTicket', {})
});

router.get('/viewTickets', async function(req,res){
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  };

  // READ
  const tickets = await Ticket.findAll();
  console.log(tickets);

  // CREATE
  // const ticket = await Ticket.create({ 
  //   subject: 'test subject2',
  //   userId: 1,
  //   departmentId: 1,
  //   description: 'test description2',
  //   evidence: null,
  //   priority: 1,
  //   extras: null,
  //   status: 2
  // });
  // console.log("Ticket's auto-generated ID:", ticket.id);

  // DELETE
  // await Ticket.destroy({
  //   where: {
  //     subject: "test subject2"
  //   }
  // }); 
  
  // UPDATE
  // await Ticket.update({ subject: "new subject" }, {
  //   where: {
  //     subject: "test subject"
  //   }
  // });
  

  res.render('viewTickets', {})
});

module.exports = router;