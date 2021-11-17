const mongoose = require('mongoose')
const Branch = require('./branch')

// Create Schema called Customer.Equivalent of a Table in SQL databases with column names. In this case columns are name and Address
const customerSchema = new mongoose.Schema ({

name:{
    type: String,
    required: true
}
/*address:{
    type: String,
    required: false
}*/

})

customerSchema.pre('remove', function(next) {
    Branch.find({ customer: this.id }, (err, branches) => {
      if (err) {
        next(err)
      } else if (branches.length > 0) {
        next(new Error('Can not delete customer! This customer still has branches'))
      } else {
        next()
      }
    })
  })

module.exports = mongoose.model('Customer',customerSchema)