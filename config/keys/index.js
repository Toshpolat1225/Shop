if(process.env.NODE_ENV==='production'){
    console.log('prod');
    module.exports=require('../keys/keys.prod')
}else{
    module.exports=require('../keys/keys.dev')
}