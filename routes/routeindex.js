const { render } = require('ejs');
const express = require('express');
const { Parser } = require('json2csv');
const router = express.Router();
const { sequelize, Ticket, User, Department } = require('../db')
const multer  = require('multer')

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
const verify = require("./verifyAccess");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage });


router.get('/', function (req,res,next) {req.adminsOnly = false; next();}, verify, async function(req,res){
  const isAdmin = req.isAdmin;
  res.render('home', { isAdmin })
});

router.get('/logout', (req,res)=> {
  res.clearCookie("token")
  res.redirect("/")
  })

router.get('/login', async function(req,res){
  const loginFailed = false;
  res.clearCookie("token");
  res.render('login', { loginFailed })
});

router.post('/login', async function(req,res){  
  const user = User.findAll({
    where: { email: req.body.email }
    }).then(async function(users) {
      if (users.length == 0){
        const loginFailed = true;
        res.render('login', { loginFailed })
      } else {
        let valid = await bcrypt.compare(req.body.password,users[0].dataValues.password) 
      
        if (valid) {
          let token;
          if (users[0].dataValues.typeUser == "admin") {
            token = jwt.sign({id:users[0].dataValues.id, isAdministrator: true}, jwtSecret, {expiresIn: "1h"})
          } else {
            token = jwt.sign({id:users[0].dataValues.id, isAdministrator: false}, jwtSecret, {expiresIn: "1h"})
          }
          res.cookie("token", token, {httpOnly:true})
          res.redirect("/")
        } else {
          console.log("Password is invalid")
          const loginFailed = true;
          res.render('login', { loginFailed });
        }
      }
  })
});

router.get('/register', async function(req,res){
  const departmentList = await Department.findAll();
  res.render('register', { departmentList })
});

router.post('/register', async function(req,res){
  req.body.typeUser = 'user';

  const newUser = await User.create(req.body)
  .then(function(user) {
    user.update({
      password: bcrypt.hashSync(user.password,10)
    })
    res.redirect('login');
  });
});

router.get('/departments', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
  const isAdmin = req.isAdmin;
  const departmentList = await Department.findAll();
  res.render('departments', { departmentList, isAdmin })
});

router.post('/createDepartment', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
  await Department.create(req.body)
  .then(function(){
    res.redirect('/departments')
  })
  .catch(function(err){
    console.log(err)
  });
});

router.get('/deleteDepartment/:name', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
  const departmentToDelete = await Department.findByPk(req.params.name);
  await departmentToDelete.destroy()
  .then(function(){
    res.redirect('/departments')
  })
  .catch(function(err){
    console.log(err)
  });
});

router.get('/users', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){  
  const userList = await User.findAll();
  const isAdmin = req.isAdmin;
  res.render('users', { userList, isAdmin })
});

router.get('/editUser/:id', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
  const departmentList = await Department.findAll();
  const isAdmin = req.isAdmin;
  const user = await User.findByPk(req.params.id, { raw: true });
  const uid = req.params.id;
  res.render('editUser', { user, departmentList, uid, isAdmin })
});

router.post('/editUser/:id', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
  const userToEdit = await User.findByPk(req.params.id);

  await userToEdit.update({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password,10),
    typeUser: req.body.typeUser,
    departmentId: req.body.departmentId
  }).then(function(){
    res.redirect('/users')
  })
  .catch(function(err){
    console.log(err)
  });
});

router.get('/deleteUser/:id', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
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

// Falta resolver los archivos
router.get('/crearTicket', function (req,res,next) {req.adminsOnly = false; next();}, verify, async function(req,res){
  const depts = await Department.findAll({ raw: true });
  const isAdmin = req.isAdmin;
  res.render('crearTicket', { depts, isAdmin })
});

// Falta resolver los archivos
router.post('/crearTicket', upload.single('evidence'), function (req,res,next) {req.adminsOnly = false; next();}, verify, async function(req,res){
  const ticket = await Ticket.create({
    subject: req.body.subject,
    userId: req.userId,
    departmentId: req.body.departmentId,
    description: req.body.description,
    evidence: null,
    priority: req.body.priority,
    status: 1,
  })
  console.log(req.file, req.body)
  res.redirect('/viewTicket?id=' + ticket.id)
});

// Falta resolver los archivos
router.get('/editTicket', function (req,res,next) {req.adminsOnly = false; next();}, verify, async function(req,res){
  const ticket = await Ticket.findByPk(req.query.id, { 
    include: [ User, Department ], 
    raw: true 
  });
  const depts = await Department.findAll({ raw: true });
  const isAdmin = req.isAdmin;
  res.render('editTicket', { ticket, depts, isAdmin });

});

// Falta resolver los archivos
router.post('/editTicket', function (req,res,next) {req.adminsOnly = false; next();}, verify, async function(req,res){
  const ticket = await Ticket.update(
    {
      subject: req.body.subject,
      departmentId: req.body.departmentId,
      description: req.body.description,
      evidence: req.body.evidence,
      priority: req.body.priority
    },
    { where: { id: req.query.id }}
  )
  res.redirect('/misTickets');
});

router.get('/deleteTicket', function (req,res,next) {req.adminsOnly = false; next();}, verify, async function(req,res){
  const ticket = await Ticket.findByPk(req.query.id, { raw: true });
  const isAdmin = req.isAdmin;
  res.render('deleteTicket', { ticket, isAdmin });
});

router.post('/deleteTicket', function (req,res,next) {req.adminsOnly = false; next();}, verify, async function(req,res){
  const ticket = await Ticket.destroy(
    { where: { id: req.body.id }}
  )
  res.redirect('/misTickets');
});

router.get('/misTickets', function (req,res,next) {req.adminsOnly = false; next();}, verify, async function(req,res){
  const isAdmin = req.isAdmin;
  const tickets = await Ticket.findAll({
    where: { userId: req.userId },
    raw: true
  })
  res.render('misTickets', { tickets, isAdmin })
});

router.post('/updateStatus', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
  const ticket = await Ticket.update(
    { status: req.body.status },
    { where: { id: req.query.id }}
  )
  res.redirect('/viewTickets')
});

// Shaar
router.get('/viewTicket', function (req,res,next) {req.adminsOnly = false; next();}, verify, async function(req,res){
  const isAdmin = req.isAdmin;
  const ticket = await Ticket.findByPk(req.query.id, { 
    include: [ User, Department ], 
    raw: true 
  });
  res.render('viewTicket', { ticket, isAdmin });
});

router.get('/viewTickets', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
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
  const isAdmin = req.isAdmin;
  res.render('viewTickets', { cancelados, pendientes, enProgreso, completados, isAdmin });
});

router.get('/report', function (req,res,next) {req.adminsOnly = true; next();}, verify, async function(req,res){
  const tickets = await Ticket.findAll({ 
    include: [ User, Department ], 
    raw: true 
  });
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(tickets);

  res.attachment('reporte.csv');
  res.status(200).send(csv);
});

module.exports = router;