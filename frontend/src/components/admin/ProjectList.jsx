import React from "react";
import "./admin.css";

const ProjectList = ({projects, onEdit, onDelete}) => {
	if (projects.length === 0) {
		return (
			<div className="empty-state">
				<div className="empty-icon">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
					</svg>
				</div>
				<h3>No Projects Yet</h3>
				<p>Start by adding your first project to showcase your work.</p>
			</div>
		);
	}

	return (
		<>
			<div className="project-grid">
				{projects.map((project) => (
					<div key={project._id} className="project-card">
						<div className="project-image" style={{backgroundColor: "#1a1a2e"}}>
							<img
								src={project.imageUrl}
								alt={project.title}
								style={{
									objectFit: "contain",
									width: "100%",
									height: "100%",
								}}
							/>
							{project.featured && (
								<span className="featured-badge">
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
									</svg>
									Featured
								</span>
							)}
							<div className="project-actions">
								<button
									className="action-btn edit"
									onClick={() => onEdit(project)}
									title="Edit project"
								>
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
									</svg>
								</button>
								<button
									className="action-btn delete"
									onClick={() => onDelete(project._id)}
									title="Delete project"
								>
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
									</svg>
								</button>
							</div>
						</div>
						<div className="project-info">
							<span className="project-category">{project.category}</span>
							<h3 className="project-title">{project.title}</h3>
							<p className="project-description">{project.description}</p>
							<div className="project-meta">
								{project.client && (
									<span className="meta-item">
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
										</svg>
										{project.client}
									</span>
								)}
								<span className="meta-item">
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
									</svg>
									{new Date(project.completionDate).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default ProjectList;
