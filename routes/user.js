const { Router } = require("express");
const VerifyToken = require("../Middleware/VerifyToken");
const AllowedTo = require("../Middleware/AllowedTo");
const VerifyObjectId = require("../Middleware/VerifyObjectId");
const UploadAvatar = require("../Middleware/UploadAvatar");
const UserRole = require("../utils/UserRole");
const {
	index,
	show,
	update,
	count,
	upload,
	destroy,
} = require("../Controllers/User/UserController");
const Authorization = require("../Middleware/Authorization");

const router = Router();

router.route("/").get(VerifyToken, AllowedTo(UserRole.ADMIN), index);

router.route("/count").get(VerifyToken, AllowedTo(UserRole.ADMIN), count);
router.put(
	"/upload",
	VerifyToken,
	AllowedTo(UserRole.USER),
	UploadAvatar.single("avatar"),
	upload
);
router
	.route("/:id")
	.get(VerifyToken, VerifyObjectId, Authorization, show)
	.put(VerifyToken, VerifyObjectId, AllowedTo(UserRole.USER), update)
	.delete(VerifyToken, VerifyObjectId, Authorization, destroy);

module.exports = router;
