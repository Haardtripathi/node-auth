const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient

let _db;

const mongoConnect=(cb)=>{
  MongoClient.connect('mongodb+srv://Kakarot:Kakarot1231@cluster0.wjyvhwp.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
  .then(client=>{
    console.log('connected')
    _db=client.db()
    cb()
  })
  .catch(err=>{
    console.log(err);
    throw err
  })
}

const getDb=()=>{
  if(_db){
    return _db
  }
  throw 'No Database Found'
}

exports.mongoConnect=mongoConnect
exports.getDb=getDb