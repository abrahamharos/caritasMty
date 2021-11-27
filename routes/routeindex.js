const { render } = require('ejs');
const express = require('express');
const router = express.Router();
<<<<<<< HEAD
=======
const { sequelize, Ticket, User } = require('../db')
>>>>>>> e426652 (user and ticket corected models)


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

// Mau 
router.post('/crearTicket', async function(req,res){
  
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  };
  console.log("reqbody: "+req.body);
  const newTicket = await Ticket.create({
    subject: req.body.subject,
    userId: req.body.userId,
    departmentId: req.body.departmentId,
    description: req.body.description,
    evidence: req.body.evidence,
    priority: req.body.priority,
    extras: req.body.extras,
    status: req.body.status
  })
  .then(function(newTicket){
    res.json({
      "success": 'true',
      "ticket": newTicket
    });
    res.render('crearTicket', {newTicket});
  })
  .catch(function(err){
    res.json({
      "success": 'false',
      "error": err
    });
  });
  
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