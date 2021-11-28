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
  res.render('home', {})
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

// WORKS
router.get('/departments', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
// router.get('/departments', async function(req,res){
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  };

  const departmentList = await Department.findAll();
  res.render('departments', {departmentList})
});

// WORKS
router.post('/createDepartment', async function(req,res){
  await Department.create(req.body).then(function(user) {
    console.log('\nCreated Department:', user.get({ plain: true}))});
  
  var departmentList = await Department.findAll();
  res.render('departments', {departmentList})
});

// WORKS
router.get('/deleteDepartment/:name', async function(req,res){
  const departmentToDelete = await Department.findByPk(req.params.name);
  await departmentToDelete.destroy();

  var departmentList = await Department.findAll();
  res.render('departments', {departmentList})
});

// WORKS
// router.get('/users', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
  router.get('/users', async function(req,res){    
  var userList = await User.findAll();
  console.log(userList);
  res.render('users', {userList})
});

// router.get('/editUser/:id', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
router.get('/editUser/:id', async function(req,res){
  var departmentList = await Department.findAll();
  res.render('editUser', {departmentList})
});

router.post('/editUser/:id', async function(req,res){
  console.log(req.body);
  const userToEdit = await User.findAll(req.body.id);
  User.findAll({
    where: { email: req.body.email }
    })
  await userToEdit.update({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  res.render('users', {})
});

// WORKS
router.get('/deleteUser/:id', async function(req,res){
  const userToDelete = await User.findByPk(req.params.id);
  await userToDelete.destroy();

  var userList = await User.findAll();
  res.render('users', {userList})
});

// Mau 
router.get('/crearTicket', function (req,res,next) {req.adminsOnly = false; next();}, async function(req,res){
  res.render('crearTicket', {})
});

router.post('/crearTicket', function (req,res,next) {req.adminsOnly = false; next();}, verify,async function(req,res){
  
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

router.get('/editTicket', function (req,res,next) {req.adminsOnly = false; next();}, async function(req,res){
  res.render('editTicket', {})
});

router.post('/editTicket', function (req,res,next) {req.adminsOnly = false; next();},async function(req,res){
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

router.get('/misTickets', function (req,res,next) {req.adminsOnly = false; next();},async function(req,res){
  
  res.render('misTickets', {})
});

router.post('/updateStatus', function (req,res,next) {req.adminsOnly = true; next();},async function(req,res){
  const status = req.body.status;
  const id = req.query.id;
  const ticket = await Ticket.update(
    {
      status: req.body.status
    },
    {
      where: {id: req.query.id}
    }
  )
  .then(function(ticket){
   
    res.render('viewTickets.ejs', {
      success: true,
      Ticket: ticket
    })
    })
  .catch(function(err){
    console.log(err)
  })

  
});

// Shaar
router.get('/viewTicket', async function(req,res){
  const ticket = await Ticket.findByPk(req.query.id, { 
    include: [ User, Department ], 
    raw: true 
  });
  console.log(ticket);
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