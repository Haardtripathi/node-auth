const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const session=require('express-session')
const MongoDBStore=require('connect-mongodb-session')(session);
const csrf=require('csurf')
const flash=require('connect-flash')

const errorController = require('./controllers/error');



const MongoDB_URI='mongodb+srv://Kakarot:Kakarot1231@cluster0.wjyvhwp.mongodb.net/shop_authentication?retryWrites=true&w=majority&appName=Cluster0'

const User=require('./models/user')

const app = express();
const store=new MongoDBStore({
  uri:MongoDB_URI,
  collection:'sessions'
})

const csrfProtection=csrf()
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'my secret',
  resave:false,
  saveUninitialized:false,
  store:store
}))   //secret is used for signing the hash which stores our ID in the cookie; resave false means the session will not be saved on every request that is done, so on every response ; saveUninitialized ensure that no session gets saved for a request where it doesn't need to be saved because nothing was changed about it

app.use(csrfProtection)

app.use(flash())

app.use((req,res,next) => {
  if(!req.session.user){
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      // console.log('appjs',user)
      req.user=user
      req.session.user.cart = user.cart.items;
        next()
    })
    .catch(err => console.log(err));
})

app.use((req,res,next)=>{
  res.locals.isAuthenticated=req.session.isLoggedIn
  res.locals.csrfToken=req.csrfToken()
  next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


app.use(errorController.get404);

mongoose.connect(MongoDB_URI)
.then(result=>{
  app.listen(3000)
})
.catch(err=>console.log(err))