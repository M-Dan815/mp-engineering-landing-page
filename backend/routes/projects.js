const express = require("express");
const cloudinary = require("../config/cloudinary");
const Project = require("../models/Project");
const {protect} = require("../middleware/auth");

const router = express.Router();

// Get all projects (public)
router.get("/", async (req, res) => {
	try {
		const projects = await Project.find().sort({order: 1, createdAt: -1});
		res.json(projects);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: "Server error"});
	}
});

// Get featured projects (public)
router.get("/featured", async (req, res) => {
	try {
		const projects = await Project.find({featured: true})
			.sort({order: 1})
			.limit(5);
		res.json(projects);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: "Server error"});
	}
});

// Get single project (public)
router.get("/:id", async (req, res) => {
	try {
		const project = await Project.findById(req.params.id);
		if (!project) {
			return res.status(404).json({message: "Project not found"});
		}
		res.json(project);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: "Server error"});
	}
});

// Create project (protected)
router.post("/", protect, async (req, res) => {
	try {
		if (!req.files || !req.files.image) {
			return res.status(400).json({message: "Please upload an image"});
		}

		const file = req.files.image;

		// Upload to Cloudinary - NO cropping, just quality optimization
		const result = await cloudinary.uploader.upload(file.tempFilePath, {
			folder: "mp-engineering/projects",
			quality: "auto:good",
		});

		const {
			title,
			description,
			category,
			client,
			completionDate,
			featured,
			order,
		} = req.body;

		const project = await Project.create({
			title,
			description,
			category,
			client,
			completionDate: completionDate || Date.now(),
			featured: featured === "true",
			order: parseInt(order) || 0,
			imageUrl: result.secure_url,
			imagePublicId: result.public_id,
		});

		res.status(201).json(project);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: "Server error"});
	}
});

// Update project (protected)
router.put("/:id", protect, async (req, res) => {
	try {
		const project = await Project.findById(req.params.id);

		if (!project) {
			return res.status(404).json({message: "Project not found"});
		}

		const {
			title,
			description,
			category,
			client,
			completionDate,
			featured,
			order,
		} = req.body;

		// Update fields
		project.title = title || project.title;
		project.description = description || project.description;
		project.category = category || project.category;
		project.client = client !== undefined ? client : project.client;
		project.completionDate = completionDate || project.completionDate;
		project.featured = featured === "true" || featured === true;
		project.order = order !== undefined ? parseInt(order) : project.order;

		// Handle new image upload
		if (req.files && req.files.image) {
			// Delete old image from Cloudinary
			await cloudinary.uploader.destroy(project.imagePublicId);

			// Upload new image - NO cropping, just quality optimization
			const result = await cloudinary.uploader.upload(
				req.files.image.tempFilePath,
				{
					folder: "mp-engineering/projects",
					quality: "auto:good",
				}
			);

			project.imageUrl = result.secure_url;
			project.imagePublicId = result.public_id;
		}

		await project.save();
		res.json(project);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: "Server error"});
	}
});

// Delete project (protected)
router.delete("/:id", protect, async (req, res) => {
	try {
		const project = await Project.findById(req.params.id);

		if (!project) {
			return res.status(404).json({message: "Project not found"});
		}

		// Delete image from Cloudinary
		await cloudinary.uploader.destroy(project.imagePublicId);

		await Project.findByIdAndDelete(req.params.id);

		res.json({message: "Project deleted successfully"});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: "Server error"});
	}
});

// Reorder projects (protected)
router.put("/reorder/batch", protect, async (req, res) => {
	try {
		const {projects} = req.body;

		const updatePromises = projects.map((p, index) =>
			Project.findByIdAndUpdate(p._id, {order: index})
		);

		await Promise.all(updatePromises);

		res.json({message: "Projects reordered successfully"});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: "Server error"});
	}
});

module.exports = router;
