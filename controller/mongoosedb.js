const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/ecommerse')
const productSchema=new mongoose.Schema({
    product_image:{
        data:{type:String,required:true},
        content_type:{type:String}
    },
    product_name:{
        type:String,
        required:true,
        unique:true
    },
        product_price:{
        type:Number,
        required:true
    },
     product_description:{
        type:String

     },
     product_quantity:{
        type:Number,
        default:1,
        min:1
     }
    
})
module.exports=mongoose.model('products',productSchema)