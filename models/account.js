const mongoose = require('mongoose')


// Create Schema called Account.Equivalent of a Table in SQL databases with column names. In this case columns are name and Address
const accountSchema = new mongoose.Schema ({

name:{
    type: String,
    required: true
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
accountPanelServiceHistory:{
    type: String,
    required: true    
},

branch:{
    // Referencing the branch object ID
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    //referencing the Branch Collection 
    ref:'Branch'
}

})

module.exports = mongoose.model('Account',accountSchema)