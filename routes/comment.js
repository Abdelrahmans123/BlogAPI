const { Router } = require("express");
const {
	index,
	store,
	update,
	destroy,
} = require("../Controllers/Comment/CommentController");
const VerifyToken = require("../Middleware/VerifyToken");
const AllowedTo = require("../Middleware/AllowedTo");
const VerifyObjectId = require("../Middleware/VerifyObjectId");
const UserRole = require("../utils/UserRole");
const router = Router();
router
	.route("/")
	.get(VerifyToken, AllowedTo(UserRole.ADMIN), index)
	.post(VerifyToken, AllowedTo(UserRole.USER), store);
router
	.route("/:id")
	.put(VerifyObjectId, VerifyToken, update)
	.delete(VerifyObjectId, VerifyToken, AllowedTo(UserRole.USER), destroy);
module.exports = router;
