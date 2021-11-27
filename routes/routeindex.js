const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const { sequelize, Ticket, Department, User } = require('../db')

// EDUARDO

/* IMPORTANT: about routes
  In each route, you have to include an anonymous middleware function that 
  tells the "verify" function if the page is meant only for admins or not. You 
  also have to call "verify" to check if the user's token is still valid.
  Example route:

  router.get('/teststuff', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
    console.log('Hello, this is a test page')
  });
*/

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/index');
const jwtSecret = db.jwtSecret;
const verify = require("./verifyAccess")


router.get('/', function (req,res,next) {req.adminsOnly = false; next();}, verify, async function(req,res){
  res.render('crearTicket', {})
});

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
          var token
          if (users[0].dataValues.role == "Administrator") {
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

router.post('/register', async function(req,res){
  console.log(req.body);

  await User.create(req.body).then(function(user) {
    console.log('\nCreated User:', user.get({ plain: true}))});
  /*.then(function(user) {
    user.update({
      password: bcrypt.hashSync(user.password,10)
    })
    res.redirect("/")
  })*/
});

// WORKS
// router.get('/departments', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
router.get('/departments', async function(req,res){
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

router.post('/editUser', async function(req,res){
  console.log(req.body);
  const userToEdit = await User.findByPk(req.body.id);
  await userToEdit.update({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  res.render('users', {})
});

router.get('/deleteUser/:id', async function(req,res){
  const userToDelete = await User.findByPk(req.params.id);
  await userToDelete.destroy();

  var userList = await User.findAll();
  res.render('users', {userList})
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