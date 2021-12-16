const express = require('express')
const router = express.Router()
const Branch = require('../models/branch')
const Customer = require('../models/customer')
const Account = require('../models/account')
const Device = require('../models/device')
//All Accounts Route
router.get('/', async (req, res) => {
    //let query = Account.find()
    const query ={};
    if (req.query.deviceZone != null && req.query.deviceZone != ''){
        query.$expr = {
             "$regexMatch": {
                "input": {"$toString": "$name"}, 
                "regex": new RegExp(req.query.deviceZone)
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
    const devices = await Device.find(query);
res.render('devices/index',{
    devices: devices,
    searchOptions:req.query
})
}
catch(err) {
    console.log(err)
res.redirect('/')
      }        
})

// New Device Route    
router.get('/new', async(req, res) => {
    renderNewPage(res, new Device())
})

// Create Device Route
router.post('/', async (req, res) => {
   const device = new Device({
    deviceZone: req.body.deviceZone,
    deviceTerminalNumber:req.body.deviceTerminalNumber,
    deviceType: req.body.deviceType,
    deviceInstallDate: req.body.deviceInstallDate,
    account: req.body.account
   })


   try{
    const newDevice = await device.save()
             res.redirect(`accounts/${newDevice.account}`)
              
    }
    
    catch(err){
        console.log(err)
        renderNewPage(res, device, true)   
    }
})

// Show Device Route
router.get('/:id', async (req, res) => {
    try {
      const device = await Device.findById(req.params.id)
                             .populate('account')
                             .exec()
      res.render('devices/show', { device: device })
    } catch {
      res.redirect('/')
    }
  })

  // Edit Device Route
router.get('/:id/edit', async (req, res) => {
  try {
      const device = await Device.findById(req.params.id)
      renderEditPage(res, device)
    } catch {
      res.render('/')
    }
  })
  

// Update Device Route
router.put('/:id', async (req, res) => {
    let device
  
    try {
      device = await Device.findById(req.params.id)
      device.deviceZone = req.body.deviceZone
      device.deviceTerminalNumber= req.body.deviceTerminalNumber
      device.deviceType = req.body.deviceType
      device.deviceInstallDate = req.body.deviceInstallDate
      device.account = req.body.account
      


      await device.save()
      res.redirect(`/devices/${device.id}`)
    } 
    catch(err) {
        console.log(err)
      if (device != null) {
        renderEditPage(res, device, true)
      } else {
       console.log(err)
        res.redirect('/')
      }
    }
  })

  // Delete Device Page
router.delete('/:id', async (req, res) => {
    let device
    try {
      device = await Device.findById(req.params.id)
      await device.remove()
      res.redirect(`/accounts/${device.account}`)
    } catch {
      if (device != null) {
        res.render('devices/show', {
          device: device,
          errorMessage: 'Could not remove Device'
        })
      } else {
        res.redirect('/')
      }
    }
  })

  //functions

  async function renderNewPage(res, device, hasError = false) {
    renderFormPage(res, device, 'new', hasError)
  }
  
  async function renderEditPage(res, device, hasError = false) {
    renderFormPage(res, device, 'edit', hasError)
  }
  
  async function renderFormPage(res, device, form, hasError = false) {
    try {
      const accounts = await Account.find({})
      const params = {
        accounts:accounts,
        device: device
      }
      if (hasError) {
        if (form === 'edit') {
          params.errorMessage = 'Error Updating Device'
        } else {
          params.errorMessage = 'Error Creating Device'
        }
      }
      res.render(`devices/${form}`, params)
    } catch {
      res.redirect('/devices')
    }
  }
  
module.exports = router;