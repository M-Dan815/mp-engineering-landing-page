import React, {useState, useEffect} from "react";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import "./admin.css";

const API_URL = "https://mp-backend-production-97e1.up.railway.app/api";

const AdminDashboard = () => {
	const {admin, logout, token} = useAuth();
	const navigate = useNavigate();
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingProject, setEditingProject] = useState(null);
	const [activeTab, setActiveTab] = useState("projects");
	const [stats, setStats] = useState({
		total: 0,
		featured: 0,
		categories: {},
	});

	useEffect(() => {
		fetchProjects();
	}, []);

	const fetchProjects = async () => {
		try {
			const response = await fetch(`${API_URL}/projects`);
			const data = await response.json();
			setProjects(data);

			// Calculate stats
			const featured = data.filter((p) => p.featured).length;
			const categories = data.reduce((acc, p) => {
				acc[p.category] = (acc[p.category] || 0) + 1;
				return acc;
			}, {});

			setStats({
				total: data.length,
				featured,
				categories,
			});
		} catch (error) {
			console.error("Error fetching projects:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateProject = async (formData) => {
		try {
			const response = await fetch(`${API_URL}/projects`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message);
			}

			await fetchProjects();
			setShowForm(false);
			return {success: true};
		} catch (error) {
			return {success: false, error: error.message};
		}
	};

	const handleUpdateProject = async (id, formData) => {
		try {
			const response = await fetch(`${API_URL}/projects/${id}`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message);
			}

			await fetchProjects();
			setEditingProject(null);
			setShowForm(false);
			return {success: true};
		} catch (error) {
			return {success: false, error: error.message};
		}
	};

	const handleDeleteProject = async (id) => {
		if (!window.confirm("Are you sure you want to delete this project?")) {
			return;
		}

		try {
			const response = await fetch(`${API_URL}/projects/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to delete project");
			}

			await fetchProjects();
		} catch (error) {
			console.error("Error deleting project:", error);
			alert("Failed to delete project");
		}
	};

	const handleEditProject = (project) => {
		setEditingProject(project);
		setShowForm(true);
	};

	const handleLogout = () => {
		logout();
		navigate("/admin");
	};

	const closeForm = () => {
		setShowForm(false);
		setEditingProject(null);
	};

	return (
		<>
			<div className="admin-dashboard">
				{/* Sidebar */}
				<aside className="dashboard-sidebar">
					<div className="sidebar-header">
						<div className="sidebar-logo">
							<span className="logo-icon">◆</span>
							<span>MP Admin</span>
						</div>
					</div>

					<nav className="sidebar-nav">
						<button
							className={`nav-item ${activeTab === "projects" ? "active" : ""}`}
							onClick={() => setActiveTab("projects")}
						>
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path d="M3 3h18v18H3V3zm16 16V5H5v14h14z" />
							</svg>
							Projects
						</button>
						<button
							className={`nav-item ${activeTab === "stats" ? "active" : ""}`}
							onClick={() => setActiveTab("stats")}
						>
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
							</svg>
							Statistics
						</button>
					</nav>

					<div className="sidebar-footer">
						<div className="admin-info">
							<div className="admin-avatar">
								{admin?.name?.charAt(0) || "A"}
							</div>
							<div className="admin-details">
								<span className="admin-name">{admin?.name}</span>
								<span className="admin-email">{admin?.email}</span>
							</div>
						</div>
						<button className="logout-btn" onClick={handleLogout}>
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
							</svg>
							Logout
						</button>
					</div>
				</aside>

				{/* Main Content */}
				<main className="dashboard-main">
					<header className="dashboard-header">
						<div className="header-left">
							<h1>
								{activeTab === "projects" ? "Project Management" : "Statistics"}
							</h1>
							<span className="header-breadcrumb">
								Dashboard /{" "}
								{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
							</span>
						</div>
						{activeTab === "projects" && (
							<button
								className="add-project-btn"
								onClick={() => {
									setEditingProject(null);
									setShowForm(true);
								}}
							>
								<span>+</span>
								Add New Project
							</button>
						)}
					</header>

					<div className="dashboard-content">
						{activeTab === "projects" && (
							<>
								{loading ? (
									<div className="loading-container">
										<div className="loading-spinner large"></div>
										<p>Loading projects...</p>
									</div>
								) : (
									<ProjectList
										projects={projects}
										onEdit={handleEditProject}
										onDelete={handleDeleteProject}
									/>
								)}
							</>
						)}

						{activeTab === "stats" && (
							<div className="stats-grid">
								<div className="stat-card">
									<div className="stat-icon">
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path d="M3 3h18v18H3V3zm16 16V5H5v14h14z" />
										</svg>
									</div>
									<div className="stat-info">
										<span className="stat-value">{stats.total}</span>
										<span className="stat-label">Total Projects</span>
									</div>
								</div>

								<div className="stat-card">
									<div className="stat-icon featured">
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
										</svg>
									</div>
									<div className="stat-info">
										<span className="stat-value">{stats.featured}</span>
										<span className="stat-label">Featured Projects</span>
									</div>
								</div>

								<div className="stat-card full-width">
									<h3>Projects by Category</h3>
									<div className="category-stats">
										{Object.entries(stats.categories).map(
											([category, count]) => (
												<div key={category} className="category-stat">
													<span className="category-name">{category}</span>
													<div className="category-bar">
														<div
															className="category-fill"
															style={{
																width: `${(count / stats.total) * 100}%`,
															}}
														></div>
													</div>
													<span className="category-count">{count}</span>
												</div>
											)
										)}
									</div>
								</div>
							</div>
						)}
					</div>
				</main>

				{/* Project Form Modal */}
				{showForm && (
					<ProjectForm
						project={editingProject}
						onSubmit={
							editingProject ? handleUpdateProject : handleCreateProject
						}
						onClose={closeForm}
					/>
				)}
			</div>
		</>
	);
};

export default AdminDashboard;
