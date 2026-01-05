import React, {useState, useRef} from "react";
import "./admin.css";

const CATEGORIES = [
	{value: "fabrication", label: "Fabrication"},
	{value: "welding", label: "Welding"},
	{value: "cad-design", label: "CAD Design"},
	{value: "prototyping", label: "Prototyping"},
	{value: "manufacturing", label: "Manufacturing"},
	{value: "other", label: "Other"},
];

const ProjectForm = ({project, onSubmit, onClose}) => {
	const [formData, setFormData] = useState({
		title: project?.title || "",
		description: project?.description || "",
		category: project?.category || "fabrication",
		client: project?.client || "",
		completionDate: project?.completionDate
			? new Date(project.completionDate).toISOString().split("T")[0]
			: new Date().toISOString().split("T")[0],
		featured: project?.featured || false,
		order: project?.order || 0,
	});
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(project?.imageUrl || null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const fileInputRef = useRef(null);

	const handleChange = (e) => {
		const {name, value, type, checked} = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 10 * 1024 * 1024) {
				setError("Image must be less than 10MB");
				return;
			}
			setImage(file);
			setImagePreview(URL.createObjectURL(file));
			setError("");
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		if (file && file.type.startsWith("image/")) {
			if (file.size > 10 * 1024 * 1024) {
				setError("Image must be less than 10MB");
				return;
			}
			setImage(file);
			setImagePreview(URL.createObjectURL(file));
			setError("");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!project && !image) {
			setError("Please upload an image");
			return;
		}

		setLoading(true);

		const data = new FormData();
		Object.keys(formData).forEach((key) => {
			data.append(key, formData[key]);
		});

		if (image) {
			data.append("image", image);
		}

		const result = project
			? await onSubmit(project._id, data)
			: await onSubmit(data);

		if (!result.success) {
			setError(result.error);
			setLoading(false);
		}
	};

	return (
		<>
			<div className="project-form-container">
				<div className="modal-overlay" onClick={onClose}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h2>{project ? "Edit Project" : "Add New Project"}</h2>
							<button className="modal-close" onClick={onClose}>
								×
							</button>
						</div>

						{error && (
							<div className="form-error">
								<span className="error-icon">!</span>
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit} className="project-form">
							<div className="form-grid">
								{/* Image Upload */}
								<div className="form-group full-width">
									<label>Project Image</label>
									<div
										className={`image-upload-area ${
											imagePreview ? "has-image" : ""
										}`}
										onClick={() => fileInputRef.current?.click()}
										onDrop={handleDrop}
										onDragOver={(e) => e.preventDefault()}
									>
										{imagePreview ? (
											<div className="image-preview">
												<img src={imagePreview} alt="Preview" />
												<div className="image-overlay">
													<span>Click or drag to replace</span>
												</div>
											</div>
										) : (
											<div className="upload-placeholder">
												<svg viewBox="0 0 24 24" fill="currentColor">
													<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
												</svg>
												<span>Click or drag image here</span>
												<small>Max size: 10MB</small>
											</div>
										)}
									</div>
									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										style={{display: "none"}}
									/>
								</div>

								{/* Title */}
								<div className="form-group full-width">
									<label htmlFor="title">
										<span className="label-icon">{">"}</span>
										Project Title *
									</label>
									<input
										type="text"
										id="title"
										name="title"
										value={formData.title}
										onChange={handleChange}
										placeholder="Enter project title"
										required
									/>
								</div>

								{/* Description */}
								<div className="form-group full-width">
									<label htmlFor="description">
										<span className="label-icon">{">"}</span>
										Description *
									</label>
									<textarea
										id="description"
										name="description"
										value={formData.description}
										onChange={handleChange}
										placeholder="Describe the project..."
										rows={4}
										required
									/>
								</div>

								{/* Category */}
								<div className="form-group">
									<label htmlFor="category">
										<span className="label-icon">{">"}</span>
										Category *
									</label>
									<select
										id="category"
										name="category"
										value={formData.category}
										onChange={handleChange}
										required
									>
										{CATEGORIES.map((cat) => (
											<option key={cat.value} value={cat.value}>
												{cat.label}
											</option>
										))}
									</select>
								</div>

								{/* Client */}
								<div className="form-group">
									<label htmlFor="client">
										<span className="label-icon">{">"}</span>
										Client Name
									</label>
									<input
										type="text"
										id="client"
										name="client"
										value={formData.client}
										onChange={handleChange}
										placeholder="Client name (optional)"
									/>
								</div>

								{/* Completion Date */}
								<div className="form-group">
									<label htmlFor="completionDate">
										<span className="label-icon">{">"}</span>
										Completion Date
									</label>
									<input
										type="date"
										id="completionDate"
										name="completionDate"
										value={formData.completionDate}
										onChange={handleChange}
									/>
								</div>

								{/* Order */}
								<div className="form-group">
									<label htmlFor="order">
										<span className="label-icon">{">"}</span>
										Display Order
									</label>
									<input
										type="number"
										id="order"
										name="order"
										value={formData.order}
										onChange={handleChange}
										min="0"
									/>
								</div>

								{/* Featured */}
								<div className="form-group full-width">
									<label className="checkbox-label">
										<input
											type="checkbox"
											name="featured"
											checked={formData.featured}
											onChange={handleChange}
										/>
										<span className="checkbox-custom"></span>
										<span>Featured Project (Show in homepage slideshow)</span>
									</label>
								</div>
							</div>

							<div className="form-actions">
								<button type="button" className="btn-cancel" onClick={onClose}>
									Cancel
								</button>
								<button type="submit" className="btn-submit" disabled={loading}>
									{loading ? (
										<>
											<span className="loading-spinner"></span>
											{project ? "Updating..." : "Creating..."}
										</>
									) : (
										<>
											<span className="btn-icon">◆</span>
											{project ? "Update Project" : "Create Project"}
										</>
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProjectForm;
