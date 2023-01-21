const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/ecommerse')
const CartSchema=new mongoose.Schema({
    product_image:{
        type:String,
            required:true
    },
    product_name:{
        type:String,
        required:true,
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
        required:true,
        default:1
     }
    
})
module.exports=mongoose.model('Carts',CartSchema)