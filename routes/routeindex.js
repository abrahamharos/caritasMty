const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const User = require('../db/models/User');

// EDUARDO

router.get('/', async function(req,res){
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
            token = jwt.sign({id:users[0].dataValues.id, isAdministrator: true}, vSecret, {expiresIn: "1h"})
          }
          else {
            token = jwt.sign({id:users[0].dataValues.id, isAdministrator: false}, vSecret, {expiresIn: "1h"})
          }
          res.cookie("token", token, {httpOnly:true})
          res.redirect("/")
        }
      
        else {
          console.log("Password is invalid")
        }
      }
  })
});

router.get('/register', async function(req,res){
  res.render('register', {})
});

router.post('/register', async function(req,res){
  req.body.role = "User";
  req.body.username = req.body.name;
  
  const newUser = User.create(req.body)
  .then(function(user) {
    user.update({
      password: bcrypt.hashSync(user.password,10)
    })
    res.redirect("/")
  })
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
  res.render('viewTickets', {})
});

module.exports = router;