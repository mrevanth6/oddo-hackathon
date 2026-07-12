
const {login}=require('./controller/authController');

const Router=express.Router()
Router.post('/auth/login',login)
module.exports=Router;