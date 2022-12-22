const { threadId } = require('../sql_connector');
const fs=require('fs')
const mongodb=require('mongodb').MongoClient;
const url="mongodb://localhost:27017"
class product{
    add_product(req,res){
            if(req.method=="POST"){

                mongodb.connect(url,(err,result)=>{
                    if(err)
                    {console.log('error in connection',err)}
                    else
                    {
                        console.log(req.file)
                     var database=result.db('ecommerse')
                    var mycollection=database.collection('product')
                    let imgbase_64=fs.readFileSync(req.file.path).toString('base64')
                    var product_image={
                       data:req.file.filename,
                       content_type:req.file.mimetype 
                    }
                    // let product_image=req.file.filename
                    var mydata=req.body
                    var final_result={product_image,...mydata}
                    mycollection.insertOne(final_result,(err,result)=>{
                        err?console.warn('error in inserting db',err):res.render('myproduct',{message:req.body.product_name+" product added"})
                    })}
                   }) 
               
               
        }else{
        
                res.render('myproduct',{message:" "})
               }
       
      
    }

display_product (req,res){
    if(req.session.admin_name&&req.session.admin_password){
        mongodb.connect(url,async(err,result)=>{
            if(err)
            {console.log('error in connection',err)}
            else
            {
             var database= result.db('ecommerse')
            var mycollection=database.collection('product')
            var result=await mycollection.find({}).toArray()
            
                if(result){
                    // console.log(result)
                    
                    
                        res.render('displayproduct',{message:result,value:req.query.value})
                        
                    }
                    else{
                        console.warn('error in inserting db',err)
                    }
            
            }
         })
    }
     else{
        res.render('admin_page',{message:"session expired"})
     }
        
            }
        
delete_product(req,res){
    if(req.session.admin_name&&req.session.admin_password){
 
        mongodb.connect(url,(err,result)=>{
            const database=  result.db('ecommerse')
            const mycollection= database.collection('product')
            mycollection.deleteOne({product_name:req.params.product_name},(err,result)=>{
                err?console.log('error mongo',err): this.display_product(req,res)
                console.log(result)
            })
            
            
        
           })
    }
    else{
        res.render('admin_page',{message:"session expired"})
    }
    
   



}
 update_product(req,res){
    if(req.session.admin_name){

        if (req.method=="POST"){
            console.log(req.body)
             mongodb.connect(url,(err,result)=>{
            const db= result.db('ecommerse')
            const mycollection= db.collection('product')
            var data=req.body
             mycollection.updateOne({product_name:req.body.product_name},{$set:data},(err,result)=>{
                err?console.log("eror here in mongo query",err):this.display_product(req,res)
                console.log(result)
            })
        })
        }
        else{
            res.render('update_product',{message:""})
        }
    }
    else{
        res.render('admin_page',{message:"session expired"})
    }

    
} 
display_prd(req,res){
    if(req.session.admin_name&&req.session.admin_password){
        mongodb.connect(url,async(err,result)=>{
            if(err)
            {console.log('error in connection',err)}
            else
            {
             var database= result.db('ecommerse')
            var mycollection=database.collection('product')
            var result=await mycollection.find().limit(3).toArray()
            // console.log(result)
                if(result){
                    // console.log(result)
                        res.render('display',{message:result,value:req.query.value})
                        
                    }
                    else{
                        console.warn('error in inserting db',err)
                    }
            
            }
         })
    
    }else{
        res.render('admin_page',{message:"session expired"})
    }
   
} 
    
// data_matching(req,res){
//     if(req.session.admin_name&&req.session.admin_password){

//         mongodb.connect(url,async(err,result)=>{
//             if(err)
//             {console.log('error in connection',err)}
//             else
//             {
//              var database= result.db('ecommerse')
//             database.collection('admission').aggregate(
//                 {
//                     $lookup:
//                     {
//                         from:"branch",
//                         localField:'adms_id',
//                         foreignField:'adms_id'
//                     }
//                 }
//             ).toArray((err,result)=>{
//                 console.log(result)
//                 err?console.log("here is an error",err):res.render('join_display',{message:result})
//             })
//     }
//     })
//     }else{
//         res.render('admin_page',{message:"session expired"})
//     }
// }
buy_product(req,res){
            mongodb.connect(url,async(err,result)=>{
                if(err)
                {console.log('error in connection',err)}
                else
                {
                 var database= result.db('ecommerse')
                var mycollection=database.collection('product')
                var result=await mycollection.find({}).toArray()
                
                    if(result){
                        
                        console.log(result)
                    // result.image=Buffer.from(result[0].product_image.data,'base64')
                   
                            res.render('buy_product_user',{message:result,value:req.query.value})
                            
                        }
                        else{
                            console.warn('error in inserting db',err)
                        }
                
                }
             })
        
            
                }
            



}

const obj=new product()
module.exports=obj