const session = require("express-session")
const connection = require("../sql_connector")

class admin{
admin_page(req,res){
    if(req.method=='POST'){
        connection.query(`select * from admin where username ='${req.body.admin_name}' and password='${req.body.admin_password}'`,(err,result)=>{
           if(err){
            res.send('error in your query',err)
           console.log('error in your query',err)
           }           
            else if(result.length=1)
            {
                req.session.admin_name=result[0].username,
                req.session.admin_password=result[0].password 
                console.log(result)
                console.log(req.session.admin_name)
            console.log(req.body)
            // console.log("result is",result)
            res.render('admin_records',{message:req.query.message});
        }else{
            res.render('admin_page',{message:'invalid login'})
        }
            



        })

    }
    else{
        res.render('admin_page',{message:''})
    }
}

add_admin(req,res){
        if(req.method=="POST"){
            var data=req.body
            connection.query('insert into admin Set?',data,(err,result)=>{
           err? res.render('add_admin_form',{message:"admin with "+req.body.username+" already exist"}):res.render('add_admin_form',{message:req.body.username+" is selected as new admin "})
           console.log(result)
           
            })
            
        }
        else{
            res.render('add_admin_form',{message:""})
        }
    }
   
       
    






}
const obj=new admin()
module.exports=obj