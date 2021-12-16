const express = require('express')
const router = express.Router()
const Branch = require('../models/branch')
const Device = require('../models/device')
const Account = require('../models/account')
const Service= require('../models/service')
//All Accounts Route
router.get('/', async (req, res) => {
    //let query = Account.find()
    const query ={};
    if (req.query.name != null && req.query.name != ''){
        query.$expr = {
             "$regexMatch": {
                "input": {"$toString": "$name"}, 
                "regex": new RegExp(req.query.name)
             }
         }
     }
try{
    const accounts = await Account.find(query);
res.render('accounts/index',{
    accounts: accounts,
    searchOptions:req.query
})
}
catch(err) {
    console.log(err)
res.redirect('/')
      }        
})

// New Account Route    
router.get('/new', async(req, res) => {
    renderNewPage(res, new Account())
})

// Create Account Route
router.post('/', async (req, res) => {
   const account = new Account({
       name: req.body.name,
       branch: req.body.branch,
       accountType: req.body.accountType,
       accountPanelManufacturer: req.body.accountPanelManufacturer,
       accountPanelModelNumber: req.body.accountPanelModelNumber,
       accountPanelPhoneNumber:req.body.accountPanelPhoneNumber,
       accountPanelLocation: req.body.accountPanelLocation,
       accountPanelSpecialNotes: req.body.accountPanelSpecialNotes,
       accountPanelServiceHistory: req.body.accountPanelServiceHistory
   })


   try{
    const newAccount = await account.save()
             res.redirect(`accounts/${newAccount.id}`)
              
    }
    
    catch(err){
        console.log(err)
        renderNewPage(res, account, true)   
    }
})

//Show Account details 
router.get('/:id',async (req,res)=>{
  try {
      const account = await Account.findById(req.params.id)
      const branch = await Branch.findById(account.branch)
      const devices = await Device.find({ account: account.id }).limit(25).exec()
      const serviceHistory = await Service.find({ account: account.id }).limit(25).exec()
      res.render('accounts/show', {
        account: account,
        branch: branch,
        devicesOfAccount: devices,
        serviceOfAccount: serviceHistory
      })
    } catch(err) 
    {
      console.log(err)
      res.redirect('/')
    }
})
  // Edit Account Route
router.get('/:id/edit', async (req, res) => {
    try {
      const account = await Account.findById(req.params.id)
      renderEditPage(res, account)
    } catch {
      res.redirect('/')
    }
  })
  

// Update Account Route
router.put('/:id', async (req, res) => {
    let account
  
    try {
      account = await Account.findById(req.params.id)
      account.name = req.body.name
      account.branch = req.body.branch
      account.accountType = req.body.accountType
      account.accountPanelManufacturer= req.body.accountPanelManufacturer
      account.accountPanelModelNumber= req.body.accountPanelModelNumber
      account.accountPanelPhoneNumber=req.body.accountPanelPhoneNumber
      account.accountPanelLocation=req.body.accountPanelLocation
      account.accountPanelSpecialNotes= req.body.accountPanelSpecialNotes
      account.accountPanelServiceHistory= req.body.accountPanelServiceHistory

      await account.save()
      res.redirect(`/accounts/${account.id}`)
    } 
    catch(err) {
        console.log(err)
      if (account != null) {
        renderEditPage(res, account, true)
      } else {
       console.log(err)
        res.redirect('/')
      }
    }
  })

  // Delete Account Page
router.delete('/:id', async (req, res) => {
    let account

    try {
      account = await Account.findById(req.params.id)
      await account.remove()
      res.redirect('/accounts')
    } catch {
      if (account != null) {
        res.render('accounts/show', {
          account: account,
          errorMessage: 'Could not remove Account'
        })
      } else {
        res.redirect('/')
      }
    }
  })

  //functions

  async function renderNewPage(res, account, hasError = false) {
    renderFormPage(res, account, 'new', hasError)
  }
  
  async function renderEditPage(res, account, hasError = false) {
    renderFormPage(res, account, 'edit', hasError)
  }
  
  async function renderFormPage(res, account, form, hasError = false) {
    try {
      const branches = await Branch.find({})
      const params = {
        branches:branches,
        account: account
      }
      if (hasError) {
        if (form === 'edit') {
          params.errorMessage = 'Error Updating Account'
        } else {
          params.errorMessage = 'Error Creating Account'
        }
      }
      res.render(`accounts/${form}`, params)
    } catch {
      res.redirect('/accounts')
    }
  }
  
module.exports = router;