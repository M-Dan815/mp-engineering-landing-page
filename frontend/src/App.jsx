import React, {useState, useEffect, useRef} from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import {AuthProvider, useAuth} from "./context/AuthContext";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import CustomCursor from "./components/CustomCursor";
import "./index.css";
import "./components/admin/admin.css";
import ContactPage from "./components/ContactPage";
// API URL for fetching projects
const API_URL = "https://mp-backend-production-97e1.up.railway.app/api";

// Protected Route Component
const ProtectedRoute = ({children}) => {
	const {isAuthenticated, loading} = useAuth();

	if (loading) {
		return (
			<div className="admin-login-container">
				<div className="loading-container">
					<div className="loading-spinner large"></div>
					<p>Loading...</p>
				</div>
			</div>
		);
	}

	return isAuthenticated ? children : <Navigate to="/admin" replace />;
};

// Main Landing Page Component
const LandingPage = () => {
	// --- State ---
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [slideshowVisible, setSlideshowVisible] = useState(false);
	const [projectPhotos, setProjectPhotos] = useState([]);

	// --- Refs ---
	const slideshowRef = useRef(null);

	const SLIDESHOW_STYLE = "right-side";

	// Fetch featured projects from API
	useEffect(() => {
		const fetchFeaturedProjects = async () => {
			try {
				const response = await fetch(`${API_URL}/projects/featured`);
				const data = await response.json();

				if (data.length > 0) {
					setProjectPhotos(
						data.map((p) => ({
							src: p.imageUrl,
							alt: p.title,
						}))
					);
				} else {
					// Fallback to default images if no projects
					setProjectPhotos([
						{
							src: "https://images.pexels.com/photos/3862632/pexels-photo-3862632.jpeg",
							alt: "Custom fabrication project - Metal framework",
						},
						{
							src: "https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg",
							alt: "Precision welding project",
						},
						{
							src: "https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg",
							alt: "Industrial equipment design",
						},
					]);
				}
			} catch (error) {
				console.error("Error fetching projects:", error);
				// Fallback images
				setProjectPhotos([
					{
						src: "https://images.pexels.com/photos/3862632/pexels-photo-3862632.jpeg",
						alt: "Custom fabrication project",
					},
				]);
			}
		};

		fetchFeaturedProjects();
	}, []);

	// --- Slideshow Auto-advance ---
	useEffect(() => {
		if (projectPhotos.length === 0) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % projectPhotos.length);
		}, 4000);

		return () => clearInterval(interval);
	}, [projectPhotos.length]);

	// --- Slideshow visibility animation ---
	useEffect(() => {
		const timer = setTimeout(() => {
			setSlideshowVisible(true);
		}, 300);
		return () => clearTimeout(timer);
	}, []);

	// --- Scroll Reveal Logic ---
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("active");
						observer.unobserve(entry.target);
					}
				});
			},
			{threshold: 0.15, rootMargin: "0px 0px -50px 0px"}
		);

		const revealElements = document.querySelectorAll(".reveal-on-scroll");
		revealElements.forEach((el) => observer.observe(el));

		return () => {
			revealElements.forEach((el) => observer.unobserve(el));
		};
	}, []);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
	const goToSlide = (index) => setCurrentSlide(index);

	// Service Data
	const services = [
		{
			id: "01",
			icon: "M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z",
			title: "Mechanical Design & CAD",
			items: [
				"2D and 3D CAD modeling using SolidWorks",
				"Weldments, sheet metal, frames, enclosures",
				"Design revisions, updates, and optimization",
				"Concept-to-production-ready CAD models",
			],
		},
		{
			id: "02",
			icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z",
			title: "Fabrication Drawings",
			items: [
				"Shop-floor ready fabrication drawings",
				"Weld symbols, tolerances, notes, standards",
				"Bills of Materials (BOMs) and cut lists",
				"DXF preparation for laser/plasma/waterjet",
			],
		},
		{
			id: "03",
			icon: "M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.86L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z",
			title: "Rapid Prototyping & DFM",
			items: [
				"Prototype-to-production transition support",
				"Design simplification and part-count reduction",
				"Cost-driven design optimization",
				"Finite Element Analysis (FEA) for design validation",
				"Iterative design based on real fabrication feedback",
			],
		},
		{
			id: "04",
			icon: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
			title: "Engineering Coordination & Project Management",
			items: [
				"Preparation for engineering review",
				"Coordination with licensed P.Eng partners",
				"Technical liaison between fabricators & clients",
				"Ensuring compliance without disrupting timelines",
			],
		},
		{
			id: "05",
			icon: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.04.17 0 .36.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.04-.22 0-.45-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
			title: "Custom Fabrication",
			items: [
				"One-off and small-batch fabrication projects",
				"Trailers, enclosures, steel structures",
				"Managed workflow using trusted partners",
				"Design through fabrication oversight",
			],
		},
		{
			id: "06",
			icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
			title: "Production Tracking",
			items: [
				"Lightweight production tracking systems",
				"BOM and configuration management",
				"Order-to-delivery visibility",
				"Simple, operator-friendly systems",
			],
		},
		{
			id: "07",
			icon: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
			title: "Quality Control & Process Improvement",
			items: [
				"Basic quality control check systems",
				"Defect and issue tracking",
				"Root-cause documentation support",
				"Practical process improvements for small shops",
				"Inspection checklists and verification procedures",
				"First-article inspection (FAI) documentation",
				"Weld quality and dimensional verification",
			],
		},
		{
			id: "08",
			icon: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z",
			title: "Engineering Review & P.Eng Stamping",
			items: [
				"Coordination with licensed Professional Engineers (P.Eng)",
				"Complete engineering-ready design package preparation",
				"Review process management with engineering partners",
				"Coverage for Ontario and other Canadian jurisdictions",
				"Stamping fees quoted separately per engineer's scope",
			],
			note: "All certification performed by licensed engineers who assume professional responsibility.",
		},
	];

	return (
		<>
			{/* Header */}
			<header>
				<div className="container nav-container header-margin">
					<a href="#" className="logo">
						<img
							alt="icon/png"
							src="/invert.png"
							style={{height: "80px", width: "auto"}}
						/>
					</a>
					<nav>
						<button className="mobile-menu-btn" onClick={toggleMenu}>
							☰
						</button>
						<ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
							<li>
								<a
									href="#contact"
									className="text-primary"
									onClick={toggleMenu}
								>
									Contact
								</a>
							</li>
						</ul>
					</nav>
				</div>
			</header>

			{/* Hero Section */}
			<section
				className={`hero ${
					SLIDESHOW_STYLE === "right-side" ? "hero-split" : ""
				}`}
			>
				<div className="hero-bg"></div>
				<div className="hero-overlay"></div>

				<div className="container hero-content-wrapper">
					<div className="hero-content">
						<span className="hero-subtitle reveal-on-scroll">
							Design • Build • Optimize
						</span>
						<h1 className="reveal-on-scroll delay-100">
							Professional Mechanical Engineering Services
						</h1>
						<p className="reveal-on-scroll delay-200 text-xs">
							Mechanical design, CAD, and manufacturing support for growing
							manufacturers. We help you design, document, and build faster —
							without hiring a full engineering department.
						</p>
						<div
							style={{display: "flex", gap: "1rem", flexWrap: "wrap"}}
							className="reveal-on-scroll delay-300"
						>
							<a href="/contact" className="btn btn-primary">
								Initialize Project
							</a>
							<a href="#services" className="btn btn-outline">
								Explore Systems
							</a>
						</div>
					</div>

					{SLIDESHOW_STYLE === "right-side" && projectPhotos.length > 0 && (
						<div
							ref={slideshowRef}
							className={`hero-slideshow-container ${
								slideshowVisible ? "slideshow-visible" : ""
							}`}
						>
							<div className="slideshow-frame">
								<div className="slideshow-corner top-left"></div>
								<div className="slideshow-corner top-right"></div>
								<div className="slideshow-corner bottom-left"></div>
								<div className="slideshow-corner bottom-right"></div>

								<div className="slideshow-wrapper">
									{projectPhotos.map((photo, index) => (
										<div
											key={index}
											className={`slide ${
												index === currentSlide ? "active" : ""
											}`}
										>
											<img
												src={photo.src}
												alt={photo.alt}
												style={{
													objectFit: "contain",
													width: "100%",
													height: "100%",
													backgroundColor: "#0a0a0f",
												}}
											/>
										</div>
									))}
								</div>

								<div className="slide-counter">
									<span className="current">
										{String(currentSlide + 1).padStart(2, "0")}
									</span>
									<span className="separator">/</span>
									<span className="total">
										{String(projectPhotos.length).padStart(2, "0")}
									</span>
								</div>

								<div className="slide-progress">
									<div className="slide-progress-bar" key={currentSlide}></div>
								</div>
							</div>

							{/* NEW: Project Title Display */}
							<div className="slideshow-label">
								<span className="slide-title-label">Project:</span>
								<h3 className="slide-title">
									{projectPhotos[currentSlide]?.alt || "Featured Project"}
								</h3>
							</div>

							<div className="slide-indicators">
								{projectPhotos.map((_, index) => (
									<button
										key={index}
										className={`slide-indicator ${
											index === currentSlide ? "active" : ""
										}`}
										onClick={() => goToSlide(index)}
										aria-label={`Go to slide ${index + 1}`}
									/>
								))}
							</div>

							<div className="slideshow-label">
								<span className="label-icon">◆</span>
								<span>Our Completed Projects</span>
							</div>
						</div>
					)}
				</div>
			</section>

			{/* Intro / About */}
			<section id="about" className="section-padding intro">
				<div className="container">
					<div className="section-header text-center reveal-on-scroll">
						<h2>Practical Engineering</h2>
					</div>
					<p
						className="intro-text text-center reveal-on-scroll delay-100"
						style={{
							maxWidth: "800px",
							margin: "0 auto",
							fontSize: "1.2rem",
							color: "#cbd5e1",
						}}
					>
						MP Engineering focuses on execution, clarity, and manufacturability.
						We bridge the gap between concept and fabrication through clear
						documentation, practical design, and smooth coordination.
					</p>
				</div>
			</section>

			{/* Core Capabilities Section */}
			<section id="services" className="section-padding bg-light">
				<div className="container">
					<div className="section-header text-center reveal-on-scroll">
						<span className="tech-label">SYSTEM MODULES</span>
						<h2>Core Capabilities</h2>
						<p style={{color: "var(--color-text-muted)"}}>
							Comprehensive support from initial concept to shop floor delivery.
						</p>
					</div>

					<div className="services-grid-modern">
						{services.map((service, index) => (
							<article
								key={service.id}
								className={`service-card-modern reveal-on-scroll delay-${
									(index % 3) + 1
								}00 ${service.note ? "has-note" : ""}`}
								style={{alignSelf: "start"}}
							>
								{/* Corner Markers */}
								<div className="card-corner top-left"></div>
								<div className="card-corner top-right"></div>
								<div className="card-corner bottom-right"></div>
								<div className="card-corner bottom-left"></div>

								{/* Header */}
								<div className="card-header">
									<span className="card-id">{service.id}</span>
									<div className="card-icon">
										<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path d={service.icon} />
										</svg>
									</div>
								</div>

								{/* Content */}
								<h3 className="card-title">{service.title}</h3>
								<ul className="card-list">
									{service.items.map((item, i) => (
										<li key={i}>
											<span className="bullet">{">"}</span> {item}
										</li>
									))}
								</ul>

								{/* Note for P.Eng card */}
								{service.note && (
									<div className="card-note">
										<span className="note-icon">ℹ</span>
										<span>{service.note}</span>
									</div>
								)}
							</article>
						))}
					</div>
				</div>
			</section>

			{/* Approach Section */}
			<section id="approach" className="section-padding approach">
				<div className="container approach-container">
					<div className="approach-content reveal-on-scroll">
						<span
							className="hero-subtitle"
							style={{color: "white", borderColor: "white"}}
						>
							Philosophy
						</span>
						<h2>Execution, Clarity, & Manufacturability</h2>
						<p>
							MP Engineering focuses on getting things done right the first
							time. We recognize that over-engineering can be as costly as
							under-engineering.
						</p>
						<p>
							Engineering certification or stamping is provided exclusively
							through licensed partners when required. This approach minimizes
							risk, reduces overhead, and keeps projects moving efficiently from
							concept to fabrication.
						</p>

						<ul className="approach-features">
							<li>
								<span className="check-icon">✓</span> Practical, Manufacturable
								Design
							</li>
							<li>
								<span className="check-icon">✓</span> Clear, Concise
								Documentation
							</li>
							<li>
								<span className="check-icon">✓</span> Smooth Coordination
							</li>
						</ul>
					</div>

					{/* Right Side Image with Animations */}
					<div className="approach-image-wrapper reveal-on-scroll float-animation">
						<img
							src="https://images.pexels.com/photos/3862634/pexels-photo-3862634.jpeg"
							alt="Precision Engineering Part"
							className="approach-image"
						/>
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section id="contact" className="section-padding contact">
				<div className="container">
					<div className="contact-box reveal-on-scroll">
						<div className="section-header text-center">
							<h2>Ready to Build?</h2>
						</div>
						<p className="text-center">
							Contact MP Engineering to discuss your project requirements and
							determine the most efficient path from design to production.
						</p>
						<div className="text-center">
							<a href="/contact" className="btn btn-cta">
								Establish Connection
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer>
				<div className="container">
					<div className="footer-grid">
						{/* Brand Column */}
						<div className="footer-col">
							<span className="footer-logo">MP Engineering</span>
							<p
								style={{
									fontSize: "0.9rem",
									lineHeight: "1.6",
									opacity: "0.9",
									maxWidth: "300px",
								}}
							>
								Helping small and mid-sized manufacturers turn ideas into
								production-ready products.
							</p>
						</div>

						{/* Contact Column */}
						<div className="footer-col">
							<h4>Transmission Data</h4>
							<div className="footer-contact-item">
								<svg viewBox="0 0 24 24">
									<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
								</svg>
								<div>
									<strong>Coordinates</strong>
									<br />
									1234 Innovation Drive, Tech City
									<br />
									Sector 7G, TC 90210
								</div>
							</div>
							<div className="footer-contact-item">
								<svg viewBox="0 0 24 24">
									<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
								</svg>
								<div>
									<strong>Voice Link</strong>
									<br />
									<a href="tel:+15551234567">(555) 123-4567</a>
								</div>
							</div>
							<div className="footer-contact-item">
								<svg viewBox="0 0 24 24">
									<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
								</svg>
								<div>
									<strong>Data Comms</strong>
									<br />
									<a href="mailto:hello@mpengineering.com">
										hello@mpengineering.com
									</a>
								</div>
							</div>
						</div>

						{/* Links Column */}
						<div className="footer-col">
							<h4>Systems</h4>
							<ul style={{fontSize: "0.9rem"}}>
								<li style={{marginBottom: "0.5rem"}}>
									<a href="#services">CAD Modeling</a>
								</li>
								<li style={{marginBottom: "0.5rem"}}>
									<a href="#services">Fabrication</a>
								</li>
								<li style={{marginBottom: "0.5rem"}}>
									<a href="#services">Quality Control</a>
								</li>
								<li style={{marginBottom: "0.5rem"}}>
									<a href="#contact">Contact Support</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="footer-bottom">
						<div>&copy; 2023 MP Engineering. All Systems Operational.</div>
						<div>Designed for Future Manufacturing</div>
					</div>
				</div>
			</footer>
		</>
	);
};

// Main App with Router - CustomCursor is now at the top level
const App = () => {
	return (
		<AuthProvider>
			<Router>
				{/* Custom Cursor - Now available on ALL pages */}
				<CustomCursor />

				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/admin" element={<AdminLogin />} />
					<Route path="/contact" element={<ContactPage />} />
					<Route
						path="/admin/dashboard"
						element={
							<ProtectedRoute>
								<AdminDashboard />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</Router>
		</AuthProvider>
	);
};

export default App;
