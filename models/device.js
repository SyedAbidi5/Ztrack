const mongoose = require('mongoose')


// Create Schema called Device.Equivalent of a Table in SQL databases with column names. 
const deviceSchema = new mongoose.Schema ({

deviceZone:{
    type: Number,
    required: true
},
deviceTerminalNumber:{
    type: Number,
    required: true
},
deviceType:{
    type: String,
    required: true
},
deviceInstallDate:{
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

module.exports = mongoose.model('Device',deviceSchema)