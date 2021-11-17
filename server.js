if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index') // Point to Routes
const customerRouter = require('./routes/customers') // Point to Customer Routes
const branchRouter = require('./routes/branches') // Point to Branch Routes
const accountRouter = require('./routes/accounts')
const deviceRouter = require('./routes/devices')
app.set('view engine','ejs') //Set view Engine
app.set('views', __dirname + '/views')// Set where the views will be coming from 
app.set('layout','layouts/layout')// Set Where the layouts will be
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ limit: '10mb', extended: false}))
app.use(methodOverride('_method'))

const  mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true})

    const db = mongoose.connection
    db.on('error',error => console.error(error))
    db.once('open',() => console.log('Connected to Mongoose'))



app.use('/',indexRouter)
app.use('/customers',customerRouter)//Send all /customers route to customerRouter
app.use('/branches',branchRouter)//Send all /branches route to branchRouter
app.use('/accounts',accountRouter)
app.use('/devices',deviceRouter)
app.listen(process.env.PORT || 3000)