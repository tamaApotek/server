const mongoose = require('mongoose')
const Schema = mongoose.Schema

const registerSchema = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient'
    },
    paid: {
        type: Boolean,
        default: false
    },
    delay: {
        type: Boolean,
        default: false,
    },
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })



const Register = mongoose.model('Register', registerSchema)

module.exports = Register