import React, {useState} from "react";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import "./admin.css";

const AdminLogin = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const {login} = useAuth();
	const navigate = useNavigate();
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await login(email, password);
			navigate("/admin/dashboard");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="admin-login-container">
				<div className="admin-login-box">
					{/* Tech corners */}
					<div className="login-corner top-left"></div>
					<div className="login-corner top-right"></div>
					<div className="login-corner bottom-left"></div>
					<div className="login-corner bottom-right"></div>

					<div className="login-header">
						<div className="login-icon">
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
							</svg>
						</div>
						<h1>Admin Access</h1>
						<span className="login-subtitle">// SECURE PORTAL</span>
					</div>

					{error && (
						<div className="login-error">
							<span className="error-icon">!</span>
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="login-form">
						<div className="form-group">
							<label htmlFor="email">
								<span className="label-icon">{">"}</span>
								Email Address
							</label>
							<input
								type="email"
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="admin@mpengineering.com"
								required
								disabled={loading}
							/>
						</div>

						<div className="form-group">
							<label htmlFor="password">
								<span className="label-icon">{">"}</span>
								Password
							</label>
							<input
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								required
								disabled={loading}
							/>
						</div>

						<button type="submit" className="login-btn" disabled={loading}>
							{loading ? (
								<>
									<span className="loading-spinner"></span>
									Authenticating...
								</>
							) : (
								<>
									<span className="btn-icon">⬡</span>
									Initialize Session
								</>
							)}
						</button>
					</form>

					<div className="login-footer">
						<a href="/">← Return to Main Site</a>
					</div>
				</div>

				{/* Background elements */}
				<div className="login-bg-grid"></div>
				<div className="login-bg-glow"></div>
			</div>
		</>
	);
};

export default AdminLogin;
