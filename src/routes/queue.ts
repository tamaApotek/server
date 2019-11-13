import { Router } from "express";

const router = Router();
const QueueController = require("../controller/queue");
const auth = require("../middleware/auth");

router.get("/next", auth, QueueController.nextQueue);
router.get("/totaltoday", auth, QueueController.totalQueueToday);
module.exports = router;
