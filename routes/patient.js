const router = require('express').Router()
const {PatientController} = require('../controller/patient')
const auth = require('../middleware/auth')
router.get('/all', PatientController.getAllPatient)
router.get('/:_id', PatientController.getPatient)
router.delete('/', PatientController.removePatient)
router.post('/', PatientController.addPatient)


module.exports = router