const mongoose = require('mongoose')
const { hashPassword } = require('../helper/bcrypt')
const Schema = mongoose.Schema

const dokterSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Nama lengkap harus di isi"],
        minlength: [5, "Nama lengkap harus mengandung minimal 5 huruf"],
    },
    username: {
        type: String,
        required: [true, "Username harus di isi"],
        minlength: [5, "Username harus mengandung minimal 5 huruf"],
        validate: {
            validator: function(username){
                return this.model("Dokter").findOne({username})
                .then(dokter => {
                    if(dokter) return false
                    else return true
                })
            },
            message: "Dokter dengan username ini telah terdaftar"
        }
    },
    password: {
        type: String,
        required: [true, "Password harus di isi"],
        minlength: [5, "Password harus mengandung minimal 5 huruf"]
    },
    jamPraktek: {
        senin: {
            from: {
                type: String,
                default: "Tutup"
            },
            to: {
                type: String,
                default: "Tutup"
            },
        },
        selasa: {
            from: {
                type: String,
                default: "Tutup"
            },
            to: {
                type: String,
                default: "Tutup"
            },
        },
        rabu: {
            from: {
                type: String,
                default: "Tutup"
            },
            to: {
                type: String,
                default: "Tutup"
            },
        },
        kamis: {
            from: {
                type: String,
                default: "Tutup"
            },
            to: {
                type: String,
                default: "Tutup"
            },
        },
        jumat: {
            from: {
                type: String,
                default: "Tutup"
            },
            to: {
                type: String,
                default: "Tutup"
            },
        },
        sabtu: {
            from: {
                type: String,
                default: "Tutup"
            },
            to: {
                type: String,
                default: "Tutup"
            },
        },
        minggu: {
            from: {
                type: String,
                default: "Tutup"
            },
            to: {
                type: String,
                default: "Tutup"
            },
        },
    },
    statusPraktek: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: ""
    },
    spesialis: {
        type: String,
        default: ""
    }

})

dokterSchema.pre('save', function(next){
    this.password = hashPassword(this.password)
    next()
})

const Dokter = mongoose.model('Dokter', dokterSchema)

module.exports = Dokter