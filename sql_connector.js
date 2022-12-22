const mysql=require('mysql')

const connection =mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"data"
})
connection.connect((err,result)=>{
    err?console.log("connection error",err):console.warn("connected")
})

module.exports=connection