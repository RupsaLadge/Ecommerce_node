
const  { 
    connection,
    session,
    app,encoder
} =require('./config/server.js');

global.__basedir = __dirname; //__basedir diye root directory ta pawa jy

//login check middleware
const requireAuth = (req, res, next) => { //requireAuth r kaj holo check kora user login ache kina
    if (req.session.user!=null) { //req.session = session, .user = variable name of session
        next(); // User is authenticated, continue to next middleware
    } else {
        res.redirect('/login'); // User is not authenticated, redirect to login page
    }
}
//dashboard
const dashboard_routes = require('./routes/dashboard.js'); //from dashboard.js pulling urls.
app.use('/dashboard',requireAuth, dashboard_routes);


//home
const home_routes = require('./routes/home.js'); //from dashboard.js pulling urls.
app.use('/',home_routes);

//login
const login_routes = require('./routes/login.js');
app.use('/login', login_routes);


//register
const reg_routes = require('./routes/register.js'); //routes r mddhe register.js ache 
//setak reg_routes variable r mddhe store korche
app.use('/register', reg_routes);// jkhn url e /register lekha hche tkhn reg_routes e hit korche

//category
const cat_routes = require('./routes/category.js');
app.use('/category',requireAuth, cat_routes);

//myaccount
const myacc_routes = require('./routes/myaccount.js');
app.use('/myaccount',requireAuth, myacc_routes);

//products
const prod_routes = require('./routes/products.js');
app.use('/products',requireAuth, prod_routes);

//wishlist
const wish_routes = require('./routes/wishlist.js');
app.use('/wishlist',requireAuth, wish_routes);

//cart
const cart_routes = require('./routes/cart.js');
app.use('/cart',requireAuth, cart_routes);

//checkout
const check_routes = require('./routes/checkout.js');
app.use('/checkout',requireAuth, check_routes);

//contact
const contact_routes = require('./routes/contact.js');
app.use('/contact', contact_routes);

//productdetail
const pd_routes = require('./routes/productdetail.js');
app.use('/productdetail', pd_routes);

//productlist
const pl_routes = require('./routes/productlist.js');
app.use('/productlist', pl_routes);

//banner
const bn_routes = require('./routes/banner.js');
app.use('/banner',requireAuth, bn_routes);


app.locals.cartTotal = 0;
app.locals.user = [];
app.use(function(req, res, next) {
  if (req.session.user != null){
    var user = req.session.user;
    req.app.locals.user = user;
    //req.app.locals.cartTotal = user.cartTotal;next();
  connection.query("SELECT SUM(qty) as total FROM cart where user_id = ?",[user.id], function(err, respdata, fields){
    if(err) {
      throw err;
    } else {
      req.app.locals.cartTotal = respdata[0].total;
      //next();
    }
  });
   //next();
  }
  next();
});


app.locals.wishlistTotal = 0;
app.locals.user = [];
app.use(function(req, res, next) {
  if (req.session.user != null){
    var user = req.session.user;
    req.app.locals.user = user;
    //req.app.locals.wishlistTotal = user.wishlistTotal;next();
  connection.query("SELECT COUNT(id) as total FROM wishlist where user_id = ?",[user.id], function(err, respdata, fields){
    if(err) {
      throw err;
    } else {
      req.app.locals.wishlistTotal = respdata[0].total;
      //next();
    }
  });
   //next();
  }
  next();
});
//console.log(app.locals.cartTotal);
//set app port
//app.listen(4500);

app.get('/logout',  function (req, res, next)  {
  // If the user is loggedin
  if (req.session.user) {
      req.session.user = false;
      req.app.locals.user = false;
      req.app.locals.cartTotal = 0;
      req.app.locals.wishlistTotal = 0;
        res.redirect('/');
  }else{
      // Not logged in
      req.app.locals.cartTotal = 0;
      req.app.locals.wishlistTotal = 0;
      res.redirect('/');
  }
});

app.listen(4500, () => {
  console.log('Server is running on port 4500');
});

