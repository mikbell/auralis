import axios from "axios";

export const axiosInstance = axios.create({
	baseURL:
		import.meta.env.MODE === "development"
			? "http://localhost:5000/api"
			: "/api",
});

// Global token provider function - will be set by AuthProvider
let globalGetToken: (() => Promise<string | null>) | null = null;

// Function to configure the global token provider
export const configureAxiosAuth = (getToken: () => Promise<string | null>) => {
	globalGetToken = getToken;
	console.log("🔧 Axios auth configured");
};

// Add a request interceptor to include the Clerk auth token
axiosInstance.interceptors.request.use(
	async (config) => {
		try {
			if (globalGetToken) {
				const token = await globalGetToken();

				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
					console.log("🔑 Auth token added to request");
				} else {
					console.log("⚠️ No auth token available");
				}
			} else {
				console.log("⚠️ Global token provider not configured");
			}
		} catch (error) {
			console.error("❌ Error getting auth token:", error);
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add a response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			console.error("🚫 Authentication failed - redirecting to sign in");
			// Optional: redirect to sign in page
			// window.location.href = '/sign-in';
		}
		return Promise.reject(error);
	}
);
