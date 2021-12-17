const express = require('express')
const router = express.Router()
const Branch = require('../models/branch')
const Customer = require('../models/customer')
const Account = require('../models/account')
//All Branches Route
router.get('/', async (req, res) => {
    let query = Branch.find()
 
    if (req.query.name != null && req.query.name != ''){
        query= query.regex('name',new RegExp(req.query.name,'i'))
        }
    if (req.query.customer != null && req.query.customer != ''){
            query= query.regex('customer',new RegExp(req.query.customer,'i'))
            }    

try{
const branches = await query.exec()
res.render('branches/index',{
    branches: branches,
    searchOptions:req.query
})
}
catch {
res.redirect('/')
      }        
})

// New Branch Route    
router.get('/new', async(req, res) => {
    renderNewPage(res, new Branch())
})

// Create Branch Route
router.post('/', async (req, res) => {
   const branch = new Branch({
       name: req.body.name,
       customer: req.body.customer,
       address: req.body.address,
       zipCode: req.body.zipCode,
       pointOfContact: req.body.pointOfContact

   })


   try{
    const newBranch = await branch.save()
             res.redirect(`branches/${newBranch.id}`)         
    }
    catch{
        renderNewPage(res, branch, true)   
    }
})

//Show Branch route
router.get('/:id',async (req,res)=>{
    try {
        const branch = await Branch.findById(req.params.id)
        const customer = await Customer.findById(branch.customer)
        const accounts = await Account.find({ branch: branch.id }).limit(10).exec()
        res.render('branches/show', {
          branch: branch,
          customer:customer,
          accountsOfBranch: accounts
        })
      } catch {
        res.redirect('/')
      }
})

  // Edit Branch Route
router.get('/:id/edit', async (req, res) => {
    try {
      const branch = await Branch.findById(req.params.id)
      renderEditPage(res, branch)
    } catch {
      res.redirect('/')
    }
  })
  

// Update Branch Route
router.put('/:id', async (req, res) => {
    let branch
  
    try {
      branch = await Branch.findById(req.params.id)
      branch.name = req.body.name
      branch.customer = req.body.customer
      branch.address = req.body.address
      branch.zipCode = req.body.zipCode
      branch.pointOfContact = req.body.pointOfContact   
      await branch.save()
      res.redirect(`/branches/${branch.id}`)
    } 
    catch {
      if (branch != null) {
        renderEditPage(res, branch, true)
      } else {
        redirect('/')
      }
    }
  })

  // Delete Branch Page
router.delete('/:id', async (req, res) => {
    let branch
    try {
      branch = await Branch.findById(req.params.id)
      await branch.remove()
      res.redirect('/branches')
    } catch(e) {
      if (branch == null) {
        res.redirect('/dashboard')
      } else {
        console.log(e)
        res.redirect(`/branches/${branch.id}`)
      }
    }
  })

  //functions

  async function renderNewPage(res, branch, hasError = false) {
    renderFormPage(res, branch, 'new', hasError)
  }
  
  async function renderEditPage(res, branch, hasError = false) {
    renderFormPage(res, branch, 'edit', hasError)
  }
  
  async function renderFormPage(res, branch, form, hasError = false) {
    try {
      const customers = await Customer.find({})
      const params = {
        customers: customers,
        branch: branch
      }
      if (hasError) {
        if (form === 'edit') {
          params.errorMessage = 'Error Updating Branch'
        } else {
          params.errorMessage = 'Error Creating Branch'
        }
      }
      res.render(`branches/${form}`, params)
    } catch {
      res.redirect('/branches')
    }
  }
  
module.exports = router;