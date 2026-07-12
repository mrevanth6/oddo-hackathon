const express=require('express')
const {login,register}=require('../controller/authController')
const {addVehicle} = require('../controller/registerratioController')
const {requireAuth}=require('../middleware/authMiddleware')

const router=express.Router()
router.post('/auth/login',login)
router.post('/auth/register',register)
router.post('/vehicles',requireAuth, addVehicle)
module.exports=router;