const mongoose = require('mongoose')
const Schema = mongoose.Schema

const patientSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Nama harus di isi"],
        minlength: [3, "Nama harus mengandung minimal 3 huruf"],
    },
    address: {
        type: String,
        required: [true, "Alamat harus di isi"],
    },
    noTelefon: {
        type: String,
        required: [true, "Nomor telefon harus di isi"],
        minlength: [7, "Masukan nomor dengan benar"],
    },
    dokterId: {
        type: Schema.Types.ObjectId,
        ref: 'Dokter'
    }
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })


const Patient = mongoose.model('Patient', patientSchema)

module.exports = Patient