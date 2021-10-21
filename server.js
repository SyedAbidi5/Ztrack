if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index') // Point to Routes

app.set('view engine','ejs') //Set view Engine
app.set('views', __dirname + '/views')// Set where the views will be coming from 
app.set('layout','layouts/layout')// Set Where the layouts will be
app.use(expressLayouts)
app.use(express.static('public'))

const  mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true})

    const db = mongoose.connection
    db.on('error',error => console.error(error))
    db.once('open',() => console.log('Connected to Mongoose'))



app.use('/',indexRouter)


app.listen(process.env.PORT || 3000)