const mongoose = require('mongoose')


// Create Schema called Customer.Equivalent of a Table in SQL databases with column names. In this case columns are name and Address
const branchSchema = new mongoose.Schema ({

name:{
    type: String,
    required: true
},
address:{
    type: String,
    
},
zipCode:{
    type: Number
},
state:{
    type:String
},
pointOfContact:{
    type: String,
    
},

customer:{
    // Referencing the customer object ID
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    //referencing the Customer Collection 
    ref:'Customer'
}

})

module.exports = mongoose.model('Branch',branchSchema)