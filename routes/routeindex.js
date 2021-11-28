const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const { sequelize, Ticket, User, Department } = require('../db')

/* IMPORTANT: about routes
  In each route, you have to include an anonymous middleware function that 
  tells the "verify" function if the page is meant only for admins or not. You 
  also have to call "verify" to check if the user's token is still valid.
  Example route:

  router.get('/teststuff', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
    console.log('Hello, this is a test page')
  });
*/

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

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/index');
const jwtSecret = db.jwtSecret;
const verify = require("./verifyAccess")


router.get('/', function (req,res,next) {req.adminsOnly = false; next();}, verify, async function(req,res){
  const depts = await Department.findAll({ raw: true });
  res.render('crearTicket', { depts })
});

// WORKS
router.get('/login', async function(req,res){
  res.render('login', {})
});

router.post('/login', async function(req,res){  

  // Validar si el usuario existe
  const user = User.findAll({
    where: { email: req.body.email }
    }).then(async function(users) {
      if (!users){
        return res.status(404).send("The user does not exist")
      }

      // Si el usuario existe, vamos a generar un token de JWT
      else {
        var valid = await bcrypt.compare(req.body.password,users[0].dataValues.password) 
      
        // Si la contraseña es correcta generamos un JWT
        if (valid) {
          var token;
          if (users[0].dataValues.typeUser == "admin") {
            token = jwt.sign({id:users[0].dataValues.id, isAdministrator: true}, jwtSecret, {expiresIn: "1h"})
          }
          else {
            token = jwt.sign({id:users[0].dataValues.id, isAdministrator: false}, jwtSecret, {expiresIn: "1h"})
          }
          res.cookie("token", token, {httpOnly:true})
          res.redirect("/")
        }
      
        else {
          console.log("Password is invalid")
          res.redirect('/login');
        }
      }
  })
});

// WORKS
router.get('/register', async function(req,res){
  var departmentList = await Department.findAll();
  res.render('register', {departmentList})
});

// WORKS
router.post('/register', async function(req,res){
  req.body.typeUser = 'user';
  console.log(req.body); 

  const newUser = await User.create(req.body)
  .then(function(user) {
    user.update({
      password: bcrypt.hashSync(user.password,10)
    })
    console.log(user);
    res.redirect('login');
  });
});

// GOOD
router.get('/departments', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
// router.get('/departments', async function(req,res){
  const departmentList = await Department.findAll();
  res.render('departments', {departmentList})
});

// GOOD
router.post('/createDepartment', async function(req,res){
  await Department.create(req.body)
  .then(function(){
    res.redirect('/departments')
  })
  .catch(function(err){
    console.log(err)
  });
});

// GOOD
router.get('/deleteDepartment/:name', async function(req,res){
  const departmentToDelete = await Department.findByPk(req.params.name);
  await departmentToDelete.destroy()
  .then(function(){
    res.redirect('/departments')
  })
  .catch(function(err){
    console.log(err)
  });
});

// GOOD
// router.get('/users', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
  router.get('/users', async function(req,res){    
  var userList = await User.findAll();
  res.render('users', {userList})
});

// GOOD
router.get('/editUser/:id', async function(req,res){
  var departmentList = await Department.findAll();
  const uid = req.params.id;
  res.render('editUser', {departmentList, uid})
});

// GOOD
router.post('/editUser/:id', async function(req,res){
  const userToEdit = await User.findByPk(req.params.id);

  await userToEdit.update({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password,10),
    departmentId: req.body.departmentId
  }).then(function(){
    res.redirect('/users')
  })
  .catch(function(err){
    console.log(err)
  });
});

// GOOD 
router.get('/deleteUser/:id', async function(req,res){
  const userToDelete = await User.findByPk(req.params.id);
  await userToDelete.destroy()
  .then(function(){
    res.redirect('/users')
  })
  .catch(function(err){
    console.log(err)
  });
});

// Mau 
router.get('/crearTicket', async function(req,res){
  const depts = await Department.findAll({ raw: true });
  res.render('crearTicket', { depts })
});

router.post('/crearTicket', async function(req,res){
  // const ticket = await Ticket.create({
  //   userId: 1,
  //   subject: req.body.subject,
  //   userId: req.body.userId,
  //   departmentId: req.body.departmentId,
  //   description: req.body.description,
  //   evidence: req.body.evidence,
  //   priority: req.body.priority
  // })

  res.redirect('/crearTicket')
});

router.get('/editTicket', async function(req,res){
  const ticket = await Ticket.findByPk(req.query.id, { 
    include: [ User, Department ], 
    raw: true 
  });
  const depts = await Department.findAll({ raw: true });
  console.log(ticket, depts);
  res.render('editTicket', { ticket, depts });
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