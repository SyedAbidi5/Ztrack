const mongoose = require('mongoose')


// Create Schema called Device.Equivalent of a Table in SQL databases with column names. 
const serviceSchema = new mongoose.Schema ({

name:{
    type: String,
    required: true,
    unique:true
},
serviceTitle:{
    type: String,
    required: true
},
serviceText:{
    type: String,
    required: true
},
serviceDate:{
    type: String,
    required: true
},
servicedBy:{
    type: String,
    required: true
},
account:{
    // Referencing the branch object ID
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    //referencing the Branch Collection 
    ref:'Account'
}

})

module.exports = mongoose.model('Service',serviceSchema)