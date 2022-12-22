const express = require('express')
const rout = express.Router()
const multer=require('multer')
const authentication = require('./controller/usercontroller')
const admin_page=require('./controller/admin')
const adding_address=require('./controller/product_controll')


const login_middleware_admin=(req,res,next)=>{
   (  req.session.admin_name &&req.session.admin_password)?next():res.render('admin_page',{message:'session expired'})
}
const login_middleware_user=(req,res,next)=>{
    (  req.session.name )?next():res.render('home',{message:'please login first'})
 }
//for image to upload


var update=multer(
    {storage:multer.diskStorage({
    destination:"./public/upload",
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now()+'.jpg')
    }
})}).single('photo')







rout.get('/', (req, res) => {
    res.render('home', { message: req.query.message })
    res.end()
})
rout.get('/newuser', (req, res) => {
    res.render('signup', { message: 0 })
})
rout.use('/newuser', (req, res) => {
    authentication.store_user(req, res)
})

rout.use('/login_check', (req, res) => {
    authentication.login_me(req, res)
})
rout.get('/welcome', (req, res) => {
    if (req.session.email != null && req.session.name != null) {
        var user_email = req.session.email
        var user_name = req.session.name
        res.render('welcome', { myemail: user_email, myname: user_name,value:req.query.value })
    }
    else {
        res.render('home', { message: "session expired" })
    }
})

rout.use("/logout",login_middleware_user, (req, res) => {
        req.session.destroy((err) => {
            console.log("session error")
        })

        res.redirect(`/?message=logout successfully`)
    
})

rout.use('/change_pass',login_middleware_user, (req, res) => {
   authentication.change_password(req,res)
})

rout.use('/admin_check',(req,res)=>{
admin_page.admin_page(req,res)
})

rout.use('/add_admin',(req,res)=>{
    admin_page.add_admin(req,res)
})
rout.use('/addproduct',update,(req,res)=>{

    adding_address.add_product(req,res)

})
rout.use("/logout_admin",login_middleware_admin, (req, res) => {
        req.session.destroy((err) => {
            console.log("session expired")

        })

        res.render('admin_page',{message:"session terminated"})
    
})
rout.use('/displayproduct',(req,res)=>{
    adding_address.display_product(req,res)
})
rout.use('/delete_product/:product_name',login_middleware_admin,(req,res)=>{
    adding_address.delete_product(req,res)
})
rout.use('/update_product',(req,res)=>{
    adding_address.update_product(req,res)
})
rout.use('/display_product',(req,res)=>{
    adding_address.display_prd(req,res)
})
// rout.use('/data_match',(req,res)=>{
//     adding_address.data_matching(req,res)
// })
rout.use('/buy_product',login_middleware_user,(req,res)=>{
    adding_address.buy_product(req,res)
})
rout.use('/signed_user',login_middleware_admin,(req,res)=>{
    authentication.signup_user(req,res)
})
module.exports = rout