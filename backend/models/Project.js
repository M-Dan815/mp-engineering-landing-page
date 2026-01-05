const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
			enum: [
				"fabrication",
				"welding",
				"cad-design",
				"prototyping",
				"manufacturing",
				"other",
			],
		},
		imageUrl: {
			type: String,
			required: true,
		},
		imagePublicId: {
			type: String,
			required: true,
		},
		client: {
			type: String,
			default: "",
		},
		completionDate: {
			type: Date,
			default: Date.now,
		},
		featured: {
			type: Boolean,
			default: false,
		},
		order: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Project", projectSchema);
