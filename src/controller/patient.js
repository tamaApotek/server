const Patient = require('../model/patient')
const Queue = require('../model/queue')
const Register = require('../model/register')
let today = null
const io = require('socket.io-emitter')({ host: 'localhost', port: 6379 });


class PatientController {
    static addPatient(req, res, next){
        const { fullName, address, noTelefon, dokterId } = req.body
        Patient.create(
            {
                fullName,
                address,
                noTelefon,
                dokterId
            }
        )
        .then(patient => {
            return Register.create({
                patientId: patient._id
            })
        })
        .then(register => {
            var start = new Date();
            start.setHours(0,0,0,0);

            var end = new Date();
            end.setHours(23,59,59,999);

            return Queue.findOneAndUpdate({
                created_at: { "$gte": start, "$lt": end },
                dokterId
            }, { $inc: { total: 1 }, $push: { registered: register._id }}, {new: true})
        })
        .then(queue => {
            today = {total: queue.total, current: queue.current}
            io.emit("addPatient", today)
            res.status(201).json({total: queue.total, current: queue.current})
        })
        .catch(next)
    }

    static removePatient(req, res, next){
        const { _id } = req.body

        Patient.deleteOne({_id})
        .then(response => {
            console.log(response)
            res.status(200).json({message: "Berhasil dihapus"})
        })
        .catch(next)
    }

    static getPatient(req, res, next){
        const { _id } = req.params
        console.log(req.params)

        Patient.findOne({_id})
        .then(patient => {
            res.status(200).json(patient)
        })
        .catch(next)
    }

    static getAllPatient(req, res, next){
        const { page } = req.query
        Patient.find().then( patients => {
            if(patients){
                if(page){
                    let take = 9
                    let takeTo = (10 * page) - 1
                    let takeFrom = takeTo - take
                    let newArray = []
                    for(let i = takeFrom; i < patients.length; i++){
                        if(i <= takeTo) {
                            newArray.push(patients[i])
                        }
                        else break
                    }
                    res.status(200).json(newArray)
                }else{
                    res.status(200).json(patients)
                }
            }
            else res.status(200).json(patients)
        })
    }
}

module.exports = {
    PatientController,
    today
}