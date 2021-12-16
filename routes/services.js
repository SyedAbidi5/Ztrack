const express = require('express')
const router = express.Router()
const Branch = require('../models/branch')
const Customer = require('../models/customer')
const Account = require('../models/account')
const Service = require('../models/service')
//All Services Route
router.get('/', async (req, res) => {
    
    const query ={};
    if (req.query.name != null && req.query.name != ''){
        query.$expr = {
             "$regexMatch": {
                "input": {"$toString": "$name"}, 
                "regex": new RegExp(req.query.name)
             }
         }
     }


  /*   if (req.query.name != null && req.query.name != ''){
        query= query.regex('name',new RegExp(req.query.name,'m'))
        }
   if (req.query.branch != null && req.query.branch != ''){
            query= query.regex('branch',new RegExp(req.query.customer,'i'))
            } */   
try{
    const services = await Service.find(query);
    
res.render('services/index',{
    services: services,
    searchOptions:req.query
})
}
catch(err) {
    console.log(err)
res.redirect('/')
      }        
})

// New Service Route    
router.get('/new', async(req, res) => {
    renderNewPage(res, new Service())
})

// Create Service Route
router.post('/', async (req, res) => {
   const service = new Service({
    name: req.body.name,
    serviceTitle:req.body.serviceTitle,
    serviceText: req.body.serviceText,
    serviceDate: req.body.serviceDate,
    servicedBy:req.body.servicedBy,
    account: req.body.account
   })


   try{
    const newService = await service.save()
             res.redirect(`services/${newService.id}`)
              
    }
    
    catch(err){
        console.log(err)
        renderNewPage(res, service, true)   
    }
})

// Show Service Route
router.get('/:id', async (req, res) => {
    try {
      const service = await Service.findById(req.params.id)
                             .populate('account')
                             .exec()
      res.render('services/show', { service: service })
    } catch {
      res.redirect('/')
    }
  })

  // Edit Service Route
router.get('/:id/edit', async (req, res) => {
    try {
      const service = await Service.findById(req.params.id)
      renderEditPage(res, service)
    } catch {
      res.redirect('/')
    }
  })
  

// Update Service Route
router.put('/:id', async (req, res) => {
    let service
  
    try {
        service = await Service.findById(req.params.id)
      
    service.name= req.body.name
    service.serviceTitle=req.body.serviceTitle
    service.serviceText= req.body.serviceText
    service.serviceDate= req.body.serviceDate
    service.servicedBy=req.body.servicedBy
    service.account= req.body.account
      


      await service.save()
      res.redirect(`/services/${service.id}`)
    } 
    catch(err) {
        console.log(err)
      if (service != null) {
        renderEditPage(res, service, true)
      } else {
       console.log(err)
        res.redirect('/')
      }
    }
  })

  // Delete Account Page
router.delete('/:id', async (req, res) => {
    let service
    try {
        service = await Service.findById(req.params.id)
      await service.remove()
      res.redirect('/services')
    } catch {
      if (service != null) {
        res.render('services/show', {
            service: service,
          errorMessage: 'Could not remove Service'
        })
      } else {
        res.redirect('/')
      }
    }
  })

  //functions

  async function renderNewPage(res, service, hasError = false) {
    renderFormPage(res, service, 'new', hasError)
  }
  
  async function renderEditPage(res, service, hasError = false) {
    renderFormPage(res, service, 'edit', hasError)
  }
  
  async function renderFormPage(res, service, form, hasError = false) {
    try {
      const accounts = await Account.find({})
      const params = {
        accounts:accounts,
        service: service
      }
      if (hasError) {
        if (form === 'edit') {
          params.errorMessage = 'Error Updating Service History'
        } else {
          params.errorMessage = 'Error Creating Service History'
        }
      }
      res.render(`services/${form}`, params)
    } catch {
      res.redirect('/services')
    }
  }
  
module.exports = router;