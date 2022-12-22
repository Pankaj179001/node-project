
const {MongoClient}=require('mongodb')
// const url='mongodb://localhost:27017'
const client=new MongoClient('mongodb://localhost:27017')

const database=async ()=>{
   await client.connect()
   const db=client.db('ecommerse')
   const collection=db.collection('product')
   return collection
}



module.exports=database