const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const { sequelize, Ticket, User, Department } = require('../db')

// EJEMPLOS DE QUERIES

/*
READ
const tickets = await Ticket.findAll({ raw: true });
console.log(tickets);

const users = await User.findAll({ raw: true });
console.log(users);

const departments = await Department.findAll({ raw: true });
console.log(departments);
*/

/*
CREATE
const department = await Department.create({ 
  name: "test department"
});
console.log("Department's auto-generated ID:", department.id);

const ticket = await Ticket.create({ 
  subject: 'test subject2',
  userId: 1,
  departmentId: 1,
  description: 'test description2',
  evidence: null,
  priority: 1,
  extras: null,
  status: 2
});
console.log("Ticket's auto-generated ID:", ticket.id);
*/

/*
DELETE
await Ticket.destroy({
  where: {
    subject: "test subject2"
  }
}); 
*/

/*
UPDATE
await Ticket.update({ subject: "new subject" }, {
  where: {
    subject: "test subject"
  }
});
*/

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

router.post('/crearTicket', async function(req,res){
  
  const {subject, departmentId, description, evidence, priority, extras, status} = req.body;
  console.log(req.body.subject);
  const ticket = await Ticket.create({
    userId: 1,
    date: new Date(),
    subject: req.body.subject,
    userId: req.body.userId,
    departmentId: req.body.departmentId,
    description: req.body.description,
    evidence: req.body.evidence,
    priority: req.body.priority
  })
  .then(function(ticket){
    res.redirect('/crearTicket')
    })
  .catch(function(err){
    console.log(err)
  })

});

router.get('/editTicket', async function(req,res){
  res.render('editTicket', {})
});

router.post('/editTicket', async function(req,res){
  const {subject, departmentId, description, evidence, priority, extras, status} = req.body;
  const ticket = await Ticket.update(
    {
      subject: req.body.subject,
      departmentId: req.body.departmentId,
      description: req.body.description,
      evidence: req.body.evidence,
      priority: req.body.priority},
    {
      where: {id: req.query.id}
    }
  )
  .then(function(ticket){
    
    res.redirect('/')
    })
  .catch(function(err){
    console.log(err)
  })
  
});

router.get('/misTickets', async function(req,res){
  res.render('misTickets', {})
});

router.post('/updateStatus', async function(req,res){
  const ticket = await Ticket.update(
    {
      status: req.body.status
    },
    {
      where: { id: req.query.id }
    }
  )
  res.redirect('/viewTicket?id=' + req.query.id);
});

// Shaar
router.get('/viewTicket', async function(req,res){
  const ticket = await Ticket.findByPk(req.query.id, { 
    include: [ User, Department ], 
    raw: true 
  });
  res.render('viewTicket', { ticket });
});

router.get('/viewTickets', async function(req,res){
  const cancelados = await Ticket.findAll({
    where: {
      status: 0
    },
    raw: true
  });
  const pendientes = await Ticket.findAll({
    where: {
      status: 1
    },
    raw: true
  });
  const enProgreso = await Ticket.findAll({
    where: {
      status: 2
    },
    raw: true
  });
  const completados = await Ticket.findAll({
    where: {
      status: 3
    },
    raw: true
  });
  res.render('viewTickets', { cancelados, pendientes, enProgreso, completados });
});

module.exports = router;