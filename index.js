require("dotenv").config();
const express = require("express");
const mongoDb = require("./config/connectionDB");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const categoryRouter = require("./routes/category");
const HTTPStatusText = require("./utils/HTTPStatusText");
const app = express();
const PORT = process.env.PORT || 4000;
//connect to database
mongoDb();
//middleware
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/categories", categoryRouter);
app.all("*", (req, res, next) => {
	res.status(404).json({
		status: HTTPStatusText.ERROR,
		message: "Resource not found",
		Code: 404,
		data: null,
	});
});
app.use((error, req, res, next) => {
	res.status(error.statusCode || 500).json({
		status: error.status || HTTPStatusText.ERROR,
		message: error.message || err,
		code: error.statusCode || 500,
		data: null,
		stack: error.stack,
	});
});
app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`);
});
