const { Router } = require("express");
const {
	index,
	show,
	count,
	store,
	update,
	destroy,
	toggleLike,
} = require("../Controllers/Post/PostController");
const VerifyToken = require("../Middleware/VerifyToken");
const AllowedTo = require("../Middleware/AllowedTo");
const VerifyObjectId = require("../Middleware/VerifyObjectId");
const UploadPost = require("../Middleware/UploadPost");
const UserRole = require("../utils/UserRole");
const router = Router();
router
	.route("/")
	.get(index)
	.post(
		VerifyToken,
		AllowedTo(UserRole.USER),
		UploadPost.single("image"),
		store
	);
router.route("/count").get(count);
router.route("/like/:id").put(VerifyObjectId, VerifyToken, toggleLike);
router
	.route("/:id")
	.get(VerifyObjectId, show)
	.put(VerifyObjectId, VerifyToken, UploadPost.single("image"), update)
	.delete(VerifyObjectId, VerifyToken, destroy);
module.exports = router;
