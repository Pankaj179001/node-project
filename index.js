const express=require('express')
const app=express()
const ourrouter=require('./route')
const session=require('express-session')
app.set('view engine','ejs')
app.use(session({
    secret:'pankaj',
    resave:'true',
    saveUninitialized:true
}))


app.use(express.static(__dirname+'/public'))
app.use(express.urlencoded())
app.use(express.json())
app.use(ourrouter)

app.listen(4020,()=>{
    console.log("http://localhost:4020")
})