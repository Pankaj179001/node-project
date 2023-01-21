const { threadId } = require('../sql_connector');
const mongoose=require('mongoose')
const {Types}=require('mongoose')
const fs=require('fs');
const alert=require('alert')
const product_model=require('./mongoosedb');
const { ObjectId } = require('mongodb');
const CartModel=require('./cartSchema')
const cartArr=[]
// const cartPro=[]
class product{
   async add_product(req,res){
            if(req.method=="POST"){
                   
                    // let imgbase_64=fs.readFileSync(req.file.path).toString('base64')
                    var product_image={
                       data:req.file.filename,
                       content_type:req.file.mimetype 
                    }
                    // let product_image=req.file.filename
                    var mydata=req.body
                    var final_result={product_image,...mydata}
                   
                    var info= new product_model(final_result)
                var result= await info.save().catch((err)=>{
                    res.render('myproduct',{message:"product "+req.body.product_name+" already added "})//for unique record error handeling
                })
                res.render('myproduct',{message:result.product_name+" product added"})
                console.log(result)

                }
               
               
        else{
        
                res.render('myproduct',{message:""})
               }
       
      
    }

async display_product (req,res){
    if(req.session.admin_name&&req.session.admin_password){
        

            var result=await product_model.find({})
            
                if(result){
                    
                    
                    
                        res.render('displayproduct',{message:result,value:req.query.value})
                        
                    }
                    else{
                        console.warn('error in inserting db',err)
                    }
            
            }
         
     else{
        res.render('admin_page',{message:"session expired"})
     }
        
            }
        
async delete_product(req,res){
    if(req.session.admin_name&&req.session.admin_password){

       await product_model.deleteOne({product_name:req.params.product_name})
       .catch(err=>console.log('error mongo',err))
       .try(result=> this.display_product(req,res), console.log(result)
       )
                  
           }
    else{
        res.render('admin_page',{message:"session expired"})
    }
    
   



}
  async update_product(req,res){
        if (req.method=="GET"){
            var pr_id=req.query.id
            res.render('update_product',{message:"",value:pr_id})
           console.log(pr_id)

        }
        else{
            console.log(req.body)
           var data=req.body
           var IdByquery=req.query.id
          const result=await product_model.updateOne({_id:ObjectId(IdByquery)},{$set:data})//does not support callback function inside it
          if(result){
            this.display_product(req,res)
            console.log(result)
           }else{
            console.log("eror here in mongo query",err)
           }
       
        }
   

    
} 
async display_prd(req,res){
           

            var result=await product_model.find().limit(3)
                if(result){
                    // console.log(result)
                        res.render('display',{message:result,value:req.query.value})
                        
                    }
                    else{
                        console.warn('error in inserting db',err)
                    }
            
            
    
   
   
} 
async buy_product(req,res){
                    var result=await product_model.find({})
                
                    if(result){
                        
                        // console.log(result)
                    // result.image=Buffer.from(result[0].product_image.data,'base64')
                   
                            res.render('buy_product_user',{message:result,value:req.query.value,searchvalue:""})
                            
                        }
                        else{
                            console.warn('error in inserting db',err)
                        }
                
                
        
            
                }
            
async search_product(req,res){
    console.log(req.query.search)
    var result=await product_model.find({
        "$or":[
            {
                product_name:{$regex:req.query.search}
            }
        ]
    })
    console.log(result)
if(result.length==0){

    res.render('buy_product_user',{message:result,value:"no record found",searchvalue:""})

}else{
    res.render('buy_product_user',{message:result,value:req.query.search+" results are",searchvalue:req.query.search})

}
}
async cart(req,res){

   console.log(req.params._id)
      cartArr.push(req.params._id) 
   var quantity=1
    var arrSet=new Set(cartArr)
    cartArr.length == arrSet.size?quantity=1:quantity=quantity+1     //to not allow duplicate products to be added
   var cartResult=await product_model.findOne({_id:new ObjectId(req.params._id)})
   if(cartResult){
    console.log(cartResult)
    var cartdata={
        product_image:cartResult.product_image.data,
        product_name:cartResult.product_name,
        product_price:cartResult.product_price,
        product_description:cartResult.product_description,
        product_quantity:quantity
      }
    const  pushTocart=new CartModel(cartdata)
  var result= await pushTocart.save()
     
    res.render('cart',{Data:result,alreadryAdded:""})

   }
   
//    else{
//     // res.render('cart',{Data:"",alreadryAdded:"product already added to cart"})
//     alert('product already added to cart')
//    }
 }


 async cartdisplay(req,res){
    
const data=await CartModel.find()

 var price=data.reduce((a,b)=>{
    return a+b.product_price
},0)
res.render('displayCart',{message:data,totalprice:price})

 }
 async deletecart(req,res){
    var id=req.params._id
    await CartModel.deleteOne({_id:new ObjectId(id)})
    .then(res.redirect('/cartdisplay'))
}


}

const obj=new product()
module.exports=obj