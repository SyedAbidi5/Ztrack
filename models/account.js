const mongoose = require('mongoose')
const Device = require('./device')
const Service = require('./service')

// Create Schema called Account.Equivalent of a Table in SQL databases with column names. In this case columns are name and Address
const accountSchema = new mongoose.Schema ({

name:{
    type: String,
    required: true,
    unique:true
},
accountType:{
    type: String,
    required: true
},
accountPanelManufacturer:{
    type: String,
    required: true
},
accountPanelModelNumber:{
    type: String,
    required: true
},
accountPanelPhoneNumber:{
    type: Number,
    required: true    
},
accountPanelLocation:{
    type: String,
    required: true    
},
accountPanelSpecialNotes:{
    type: String
},
branch:{
    // Referencing the branch object ID
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    //referencing the Branch Collection 
    ref:'Branch'
}

})

accountSchema.pre('remove', function(next) {
    Device.find({ account: this.id }, (err, devices) => {
      if (err) {
        next(err)
      } else if (devices.length > 0) {
        next(new Error('Can not delete Account! This account still has devices'))
      } else {
        next()
      }
    })
  })

  accountSchema.pre('remove', function(next) {
    Service.find({ account: this.id }, (err, services) => {
      if (err) {
        next(err)
      } else if (services.length > 0) {
        next(new Error('Can not delete Account! This account still has service History'))
      } else {
        next()
      }
    })
  })

module.exports = mongoose.model('Account',accountSchema)