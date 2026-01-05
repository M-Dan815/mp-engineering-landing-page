const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
	cors({
		origin: "http://localhost:5173", // Vite default port
		credentials: true,
	})
);
app.use(express.json());
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
		limits: {fileSize: 10 * 1024 * 1024}, // 10MB limit
	})
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Health check
app.get("/api/health", (req, res) => {
	res.json({status: "OK", message: "Server is running"});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
