const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const {protect} = require("../middleware/auth");

const router = express.Router();

// Login
router.post("/login", async (req, res) => {
	try {
		const {email, password} = req.body;

		const admin = await Admin.findOne({email});

		if (!admin) {
			return res.status(401).json({message: "Invalid credentials"});
		}

		const isMatch = await bcrypt.compare(password, admin.password);

		if (!isMatch) {
			return res.status(401).json({message: "Invalid credentials"});
		}

		const token = jwt.sign({id: admin._id}, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		res.json({
			token,
			admin: {
				id: admin._id,
				name: admin.name,
				email: admin.email,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: "Server error"});
	}
});

// Verify token
router.get("/verify", protect, async (req, res) => {
	res.json({
		admin: {
			id: req.admin._id,
			name: req.admin.name,
			email: req.admin.email,
		},
	});
});

// Change password
router.put("/change-password", protect, async (req, res) => {
	try {
		const {currentPassword, newPassword} = req.body;

		const admin = await Admin.findById(req.admin._id);
		const isMatch = await bcrypt.compare(currentPassword, admin.password);

		if (!isMatch) {
			return res.status(400).json({message: "Current password is incorrect"});
		}

		admin.password = await bcrypt.hash(newPassword, 10);
		await admin.save();

		res.json({message: "Password updated successfully"});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: "Server error"});
	}
});

module.exports = router;
