import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

interface AuthStore {
	isAdmin: boolean;
	isLoading: boolean;
	error: string | null;
	userInfo: any;

	checkAdminStatus: () => Promise<void>;
	getUserInfo: () => Promise<void>;
	reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	isAdmin: false,
	isLoading: false,
	error: null,
	userInfo: null,

	getUserInfo: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/auth/me");
			const userInfo = response.data;
			console.log('🔍 User Info Debug:', userInfo);
			set({ 
				userInfo,
				isAdmin: userInfo.isAdmin 
			});
		} catch (error: any) {
			console.error('❌ Error getting user info:', error.response?.data || error.message);
			set({ 
				isAdmin: false, 
				error: error.response?.data?.message || error.message,
				userInfo: null
			});
		} finally {
			set({ isLoading: false });
		}
	},

	checkAdminStatus: async () => {
		set({ isLoading: true, error: null });
		try {
			// First try to get user info which includes admin status
			const userResponse = await axiosInstance.get("/auth/me");
			const userInfo = userResponse.data;
			console.log('👤 User Info:', userInfo);
			
			if (userInfo.isAdmin) {
				// If user is admin, verify access to admin endpoints
				try {
					const adminResponse = await axiosInstance.get("/admin/check");
					console.log('✅ Admin access confirmed:', adminResponse.data);
					set({ 
						isAdmin: true, 
						userInfo 
					});
				} catch (adminError: any) {
					console.error('❌ Admin endpoint access denied:', adminError.response?.data);
					set({ 
						isAdmin: false, 
						error: adminError.response?.data?.message || 'Admin access denied',
						userInfo 
					});
				}
			} else {
				console.log('ℹ️ User is not admin');
				set({ 
					isAdmin: false, 
					userInfo,
					error: 'User is not an admin' 
				});
			}
		} catch (error: any) {
			console.error('❌ Error in checkAdminStatus:', error.response?.data || error.message);
			set({ 
				isAdmin: false, 
				error: error.response?.data?.message || error.message,
				userInfo: null
			});
		} finally {
			set({ isLoading: false });
		}
	},

	reset: () => {
		set({ isAdmin: false, isLoading: false, error: null, userInfo: null });
	},
}));
