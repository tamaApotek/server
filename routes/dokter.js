const DokterController = require('../controller/dokter');
const router = require('express').Router()
const auth = require('../middleware/auth')
router.post("/login", DokterController.login)
router.post("/refresh", auth, DokterController.refresh)
router.post("/", DokterController.registerDokter)

router.get("/all", DokterController.getAllDokter)
router.get("/:_id", DokterController.getDokter)
router.delete("/", DokterController.removeDokter)
router.patch('/praktek', auth, DokterController.praktek)

module.exports = router
