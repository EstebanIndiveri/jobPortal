const mongoose=require('mongoose');
mongoose.Promise=global.Promise;
const bcrypt=require('bcrypt');

const usuariosSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true
    },
    nombre:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        trim:true

    },
    token:String,
    expira:Date,
    imagen:String
});
// metodo de hash pass
usuariosSchema.pre('save',async function(next){
    // pass ya est hash?
    if(!this.isModified('password')){
        return next();
    }
    // no esta hash
    const hash=await bcrypt.hash(this.password,12);
    this.password=hash;
    next();
});
// ya esta registrado=alerta
usuariosSchema.post('save', function(error,doc,next){
    // console.log(error.name,error.code);
    if(error.name==='MongoError' && error.code===11000){
         next('Ese correo ya esta registrado');
    }else{
        next(error);
    };
});
// auth usuarios
usuariosSchema.methods={
    compararPassword:function(password){
        return bcrypt.compareSync(password,this.password);
    }
}
module.exports=mongoose.model('Usuarios',usuariosSchema);