import React, {createContext, useContext, useState, useEffect} from "react";

const AuthContext = createContext(null);

const API_URL = "https://mp-backend-production-97e1.up.railway.app/api";

export const AuthProvider = ({children}) => {
	const [admin, setAdmin] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("adminToken"));
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const verifyToken = async () => {
			if (token) {
				try {
					const response = await fetch(`${API_URL}/auth/verify`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					if (response.ok) {
						const data = await response.json();
						setAdmin(data.admin);
					} else {
						logout();
					}
				} catch (error) {
					console.error("Token verification failed:", error);
					logout();
				}
			}
			setLoading(false);
		};

		verifyToken();
	}, [token]);

	const login = async (email, password) => {
		const response = await fetch(`${API_URL}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({email, password}),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || "Login failed");
		}

		localStorage.setItem("adminToken", data.token);
		setToken(data.token);
		setAdmin(data.admin);
		return data;
	};

	const logout = () => {
		localStorage.removeItem("adminToken");
		setToken(null);
		setAdmin(null);
	};

	const value = {
		admin,
		token,
		loading,
		login,
		logout,
		isAuthenticated: !!admin,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
