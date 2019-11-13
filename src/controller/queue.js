const Queue = require("../model/queue")
const Register =  require('../model/register')
class QueueController {
    static nextQueue (req, res, next) {
        let queueData = null
        var start = new Date();
        start.setHours(0,0,0,0);

        var end = new Date();
        end.setHours(23,59,59,999);

        Queue.findOne({
            created_at: { "$gte": start, "$lt": end },
            dokterId: req.decode._id
        })
        .then(queue => {
            queue.current++
            return queue.save()
        }) 
        .then(queue => {
            queueData = queue
            return Register.findOne({
                _id: queue.registered[queue.current-1]
            }).populate('patientId', ['fullName', 'address'])
        })
        .then(register => {
            const obj = {
                current: queueData.current,
                fullName: register.patientId.fullName,
                address: register.patientId.address
            }
            res.status(200).json(obj)
        })
        .catch(next)
    }
    static totalQueueToday (req, res, next) {
        let queueData = null

        var start = new Date();
        start.setHours(0,0,0,0);

        var end = new Date();
        end.setHours(23,59,59,999);

        Queue.findOne({
            created_at: { "$gte": start, "$lt": end },
            dokterId: req.decode._id
        })
        .then(queue => {
            queueData = queue
            let promise = []
            for(let i in queue.registered){
                promise.push(
                    Register.findOne({
                        _id: queue.registered[i]
                    }).populate('patientId', ['fullName', 'address', 'noTelefon'])
                )
            }
            return Promise.all(promise)
        })
        .then(registers => {
            if(registers){

                const obj = {
                    current: queueData.current,
                    total:  queueData.total,
                    patients: registers
                }
                res.status(200).json(obj)
            }
            else {
                res.status(200).json({current: queueData.current, total:  queueData.total})
            }
        })
        .catch(next)
    }


}



module.exports = QueueController