const mongoose = require('mongoose')
const Account = require('./account')

// Create Schema called Customer.Equivalent of a Table in SQL databases with column names. In this case columns are name and Address
const branchSchema = new mongoose.Schema ({

name:{
    type: String,
    required: true,
    unique:true
},
address:{
    type: String,
    required: true
    
},
zipCode:{
    type: Number,
    required: true
},
state:{
    type:String,
    required: true
},
pointOfContact:{
    type: String,
    required: true
    
},

customer:{
    // Referencing the customer object ID
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    //referencing the Customer Collection 
    ref:'customer'
}

})



branchSchema.pre('remove', function(next) {
    Account.find({ branch: this.id }, (err, accounts) => {
      if (err) {
        next(err)
      } else if (accounts.length > 0) {
        next(new Error('Can not delete Branch! This branch still has accounts'))
      } else {
        next()
      }
    })
  })

module.exports = mongoose.model('Branch',branchSchema);