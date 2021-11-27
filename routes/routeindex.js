const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const User = require('../db/models/User');
const Department = require('../db/models/Department');
const TicketModel = require('../db/models/Ticket');
//const {sequelize, models} = require('../db/index');

const { port, dbHost, dbPort, dbName, dbUser, dbPassword } = require('../config/index');
//RAW IMPLEMENTATION
const mysql = require("mysql");
const db = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
});



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


router.get('/api/tickets', async function(req,res){
  //Ticket.findAll({  

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

<<<<<<< HEAD
=======
// Mau 
router.post('/api/crearTicket', function(req,res){
 
  const {subject, userId, departmentId, description, evidence, priority, extras, status} = req.body;
  console.log(subject, userId, departmentId, description, evidence, priority, extras, status);
  const q = "INSERT INTO tickets(subject, userId, departmentId, description, evidence, priority, extras, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  db.query (q, [subject, userId, departmentId, description, evidence, priority, extras, status], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.render('crearTicket', {})
    }
  });

  
});

>>>>>>> d89a135 (temporary routes)
router.get('/editTicket', async function(req,res){
  res.render('editTicket', {})
});

router.post('/editTicket', async function(req,res){
  const {subject, userId, departmentId, description, evidence, priority, extras, status, id} = req.body;
  const q = "UPDATE tickets SET subject = ?, userId = ?, departmentId = ?, description = ?, evidence = ?, priority = ?, extras = ?, status = ? WHERE id = ?";
  db.query(q, [subject, userId, departmentId, description, evidence, priority, extras, status, id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      console.log(result);
      res.redirect('/')
    }
});
});

router.get('/misTickets', async function(req,res){
  const userId = req.body.userId;

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