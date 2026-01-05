const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI);
		console.log(`MongoDB Connected: ${conn.connection.host}`);

		// Create default admin if not exists
		const Admin = require("../models/Admin");
		const adminExists = await Admin.findOne({email: process.env.ADMIN_EMAIL});

		if (!adminExists) {
			const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
			await Admin.create({
				email: process.env.ADMIN_EMAIL,
				password: hashedPassword,
				name: "Admin",
			});
			console.log("Default admin account created");
		}
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
};

module.exports = connectDB;
