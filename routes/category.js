const { Router } = require("express");
const {
	store,
	index,
	destroy,
} = require("../Controllers/Category/CategoryController");
const VerifyToken = require("../Middleware/VerifyToken");
const AllowedTo = require("../Middleware/AllowedTo");
const VerifyObjectId = require("../Middleware/VerifyObjectId");
const UserRole = require("../utils/UserRole");
const router = Router();
router
	.route("/")
	.get(index)
	.post(VerifyToken, AllowedTo(UserRole.ADMIN), store);
router
	.route("/:id")
	.delete(VerifyObjectId, VerifyToken, AllowedTo(UserRole.ADMIN), destroy);
module.exports = router;
