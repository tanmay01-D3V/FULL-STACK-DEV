const router = require("express").Router();
const controller = require("../controller/services-controller");
const authenticate = require("../middleware/auth");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", authenticate, controller.create);
router.put("/:id", authenticate, controller.update);
router.delete("/:id", authenticate, controller.remove);

module.exports = router;
