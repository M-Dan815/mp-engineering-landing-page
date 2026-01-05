import React, {useState, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";
import "./ContactPage.css";

const ContactPage = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Scroll reveal effect
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
			{threshold: 0.1}
		);

		const revealElements = document.querySelectorAll(".reveal-on-scroll");
		revealElements.forEach((el) => observer.observe(el));

		return () => {
			revealElements.forEach((el) => observer.unobserve(el));
		};
	}, []);

	const handleChange = (e) => {
		const {name, value} = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate form submission
		setTimeout(() => {
			console.log("Form submitted:", formData);
			setIsSubmitting(false);
			// Redirect to homepage
			navigate("/");
		}, 1000);
	};

	return (
		<div className="contact-page">
			{/* Header */}
			<header className="contact-header">
				<div className="container nav-container">
					<Link to="/" className="logo">
						<img
							alt="MP Engineering Logo"
							src="/invert.png"
							style={{height: "80px", width: "auto"}}
						/>
					</Link>
					<nav>
						<ul className="nav-links">
							<li>
								<Link to="/" className="nav-link">
									← Back to Home
								</Link>
							</li>
						</ul>
					</nav>
				</div>
			</header>

			{/* Main Content */}
			<main className="contact-main">
				<div className="contact-container">
					{/* Left Side - Orange Section */}
					<div className="contact-info-section reveal-on-scroll">
						{/* Decorative Grid Pattern */}
						<div className="info-grid-pattern"></div>

						{/* Glowing Orb */}
						<div className="info-glow-orb"></div>

						<div className="info-content">
							{/* Tech Label */}
							<span className="info-tech-label">
								<span className="label-bracket">[</span>
								ESTABLISH_CONNECTION
								<span className="label-bracket">]</span>
							</span>

							<h1 className="info-title">
								Let's Build
								<br />
								<span className="title-highlight">Something Great</span>
							</h1>

							<p className="info-description">
								Ready to transform your ideas into production-ready solutions?
								Our engineering team is standing by to discuss your project
								requirements.
							</p>

							{/* Contact Details */}
							<div className="info-details">
								<div className="info-item">
									<div className="info-icon">
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
										</svg>
									</div>
									<div className="info-text">
										<span className="info-label">COORDINATES</span>
										<span className="info-value">
											1234 Innovation Drive, Tech City
										</span>
									</div>
								</div>

								<div className="info-item">
									<div className="info-icon">
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
										</svg>
									</div>
									<div className="info-text">
										<span className="info-label">VOICE_LINK</span>
										<span className="info-value">(555) 123-4567</span>
									</div>
								</div>

								<div className="info-item">
									<div className="info-icon">
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
										</svg>
									</div>
									<div className="info-text">
										<span className="info-label">DATA_COMMS</span>
										<span className="info-value">hello@mpengineering.com</span>
									</div>
								</div>
							</div>

							{/* Status Indicator */}
							<div className="status-indicator">
								<span className="status-dot"></span>
								<span className="status-text">
									Systems Online • Ready to Connect
								</span>
							</div>

							{/* Decorative Lines */}
							<div className="decorative-lines">
								<div className="dec-line"></div>
								<div className="dec-line"></div>
								<div className="dec-line"></div>
							</div>
						</div>

						{/* Corner Decorations */}
						<div className="info-corner top-left"></div>
						<div className="info-corner top-right"></div>
						<div className="info-corner bottom-left"></div>
						<div className="info-corner bottom-right"></div>
					</div>

					{/* Right Side - Form Section */}
					<div className="contact-form-section reveal-on-scroll">
						<div className="form-container">
							{/* Tech Corners */}
							<div className="form-corner top-left"></div>
							<div className="form-corner top-right"></div>
							<div className="form-corner bottom-left"></div>
							<div className="form-corner bottom-right"></div>

							{/* Form Header */}
							<div className="form-header">
								<span className="form-id">FORM_01</span>
								<span className="form-status">
									<span className="status-indicator-dot"></span>
									ACTIVE
								</span>
							</div>

							<h2 className="form-title">Initialize Transmission</h2>
							<p className="form-subtitle">
								Fill in the data fields below to establish communication
								protocol.
							</p>

							{/* Form */}
							<form onSubmit={handleSubmit} className="contact-form">
								{/* Name Field */}
								<div className="form-group">
									<label htmlFor="name" className="form-label">
										<span className="label-icon">{">"}</span>
										IDENTIFIER_NAME
									</label>
									<div className="input-wrapper">
										<input
											type="text"
											id="name"
											name="name"
											value={formData.name}
											onChange={handleChange}
											placeholder="Enter your name"
											required
											className="form-input"
										/>
										<div className="input-border"></div>
									</div>
								</div>

								{/* Email Field */}
								<div className="form-group">
									<label htmlFor="email" className="form-label">
										<span className="label-icon">{">"}</span>
										EMAIL_ADDRESS
									</label>
									<div className="input-wrapper">
										<input
											type="email"
											id="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											placeholder="Enter your email"
											required
											className="form-input"
										/>
										<div className="input-border"></div>
									</div>
								</div>

								{/* Phone Field */}
								<div className="form-group">
									<label htmlFor="phone" className="form-label">
										<span className="label-icon">{">"}</span>
										PHONE_NUMBER
									</label>
									<div className="input-wrapper">
										<input
											type="tel"
											id="phone"
											name="phone"
											value={formData.phone}
											onChange={handleChange}
											placeholder="Enter your phone number"
											className="form-input"
										/>
										<div className="input-border"></div>
									</div>
								</div>

								{/* Message Field */}
								<div className="form-group">
									<label htmlFor="message" className="form-label">
										<span className="label-icon">{">"}</span>
										MESSAGE_CONTENT
									</label>
									<div className="input-wrapper textarea-wrapper">
										<textarea
											id="message"
											name="message"
											value={formData.message}
											onChange={handleChange}
											placeholder="Describe your project requirements..."
											required
											rows="5"
											className="form-input form-textarea"
										></textarea>
										<div className="input-border"></div>
									</div>
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									className={`form-submit-btn ${
										isSubmitting ? "submitting" : ""
									}`}
									disabled={isSubmitting}
								>
									<span className="btn-text">
										{isSubmitting ? "TRANSMITTING..." : "SEND_TRANSMISSION"}
									</span>
									<span className="btn-icon">
										{isSubmitting ? (
											<svg className="spinner" viewBox="0 0 24 24">
												<circle
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="3"
													fill="none"
													strokeDasharray="31.4 31.4"
												/>
											</svg>
										) : (
											<svg viewBox="0 0 24 24" fill="currentColor">
												<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
											</svg>
										)}
									</span>
									<div className="btn-glow"></div>
								</button>
							</form>

							{/* Form Footer */}
							<div className="form-footer">
								<span className="footer-text">
									<span className="footer-icon">◆</span>
									All transmissions are encrypted and secure
								</span>
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* Scan Lines Overlay */}
			<div className="scan-lines"></div>
		</div>
	);
};

export default ContactPage;
