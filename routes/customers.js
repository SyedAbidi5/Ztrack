const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')
const Branch = require('../models/branch')
//All Customers Route
router.get('/', async (req, res) => {

    // Creating a variable to store search Criteria 
    let searchOptions= {}
    //Using query.name because GET request sends information through query
    // Creating checks to eliminate null inputs
    

    if (req.query.name != null && req.query.name !== ''){
        // Creating a new reg expression; The letter "i" denotes case insensitive
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try 
    {
        //Using the .find method of the customer model. 
        //We're Passing an empty string because we want to match all the customers.
        const customers = await Customer.find(searchOptions)
        res.render('customers/index',{ 
            customers: customers,
            searchOptions: req.query
        })   
    }
    catch
    {
        res.redirect('/')
    }
        
    })

// New Customer Route    
router.get('/new', (req, res) => {
    //pass variables to be sent to ejs file
    res.render('customers/new',{customer: new Customer()})
})

// Create Customer Route
router.post('/', async (req, res) => {
const customer = new Customer({
name: req.body.name
    })

try
{
const newCustomer = await customer.save()
res.redirect(`customers/${newCustomer.id}`)
}
catch
{
res.render('customers/new',{
customer:customer,
errorMessage: 'Error Creating Customer'})
}

})

router.get('/:id',async (req,res)=>{
    try {
        const customer = await Customer.findById(req.params.id)
        const branches = await Branch.find({ customer: customer.id }).limit(6).exec()
        res.render('customers/show', {
          customer: customer,
          branchesOfCustomer: branches
        })
      } catch {
        res.redirect('/')
      }
})


router.get('/:id/edit', async (req,res)=>{
    try{
        //grabbing the customer from database and putting in the customer variable,
        //The findById method is built into mongoose library
        const customer = await Customer.findById(req.params.id)
    res.render('customers/edit',{customer: customer})
    }
    //Redirect to the /customers if there is an error.
    catch{
        res.redirect('/customers')
    }
})


router.put('/:id',async (req,res)=>{
    //defining customer outside of try because it would be used inside the catch block aswell.
    let customer
        try{
            customer=await Customer.findById(req.params.id)
            customer.name= req.body.name
            await customer.save()
                res.redirect(`/customers/${customer.id}`)
        }
        catch{
            //if the search results nothing, redirect to the home page
            if( customer== null)
            {
                res.redirect('/')
            //res.send("Customer is null")
        }
            else{
                res.render('customers/edit',{
                    customer:customer,
                    errorMessage: 'Error Updating Customer'
                })
            }

            
        }
        
})


router.delete('/:id', async (req,res)=>{
    let customer
    try {
        customer=await Customer.findById(req.params.id)
      await customer.remove()
      res.redirect('/customers')
    } catch {
      if (customer == null) {
        res.redirect('/')
      } else {
        res.redirect(`/customers/${customer.id}`)
      }
    }
})



module.exports = router
