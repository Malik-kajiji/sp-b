const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const { telegramBot } = require('./functions/telegramBot')

// daily scheduler
// require('./functions/scheduler')

const app = express()
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json())
app.use(cors({
    origin:'*',
    methods:'GET,POST,PUT,DELETE',
    credentials:true
}))

telegramBot()

// owner routes
const ownerLoginRoutes = require('./routes/ownerRoutes/ownerLoginRoutes')
const ownerAdminRoutes = require('./routes/ownerRoutes/ownerAdminRoutes')
// user routes
const userAccountRoutes = require('./routes/userRoutes/accountRoutes')
const cartRoutes = require('./routes/userRoutes/cartRoutes')
const homePageRoutes = require('./routes/userRoutes/homePageRoutes')
// admin routes
const adminRoutes = require('./routes/adminRoutes/adminRoutes')
const adminHomePageRoutes = require('./routes/adminRoutes/homePageRoutes')
const groupsRoutes = require('./routes/adminRoutes/groupsRoutes')
const usersRoutes = require('./routes/adminRoutes/usersRoutes')
const subscriptionsRoutes = require('./routes/adminRoutes/subscriptionsRoutes')
const profitsRoutes = require('./routes/adminRoutes/profitsRoutes')
const requestsRoutes = require('./routes/adminRoutes/requestRoutes')


// owner end points
app.use('/owner',ownerLoginRoutes)
app.use('/owner-admin',ownerAdminRoutes)
// user end points
app.use('/user-account',userAccountRoutes)
app.use('/cart',cartRoutes)
app.use('/home-page',homePageRoutes)
// admin end points
app.use('/admins',adminRoutes)
app.use('/admin-home-page',adminHomePageRoutes)
app.use('/groups',groupsRoutes)
app.use('/users',usersRoutes)
app.use('/subscriptions',subscriptionsRoutes)
app.use('/profits',profitsRoutes)
app.use('/requests',requestsRoutes)


mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`listening to port ${process.env.PORT} & connected to mongodb`)
    })
})
.catch((err)=>{
    console.log(err)
})