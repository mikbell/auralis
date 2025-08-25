import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { configureAxiosAuth } from "../lib/axios.ts";
import { Loader } from "lucide-react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken, isLoaded } = useAuth();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initAuth = async () => {
			try {
				if (isLoaded && getToken) {
					// Configure axios to use Clerk's getToken function
					configureAxiosAuth(getToken);
					console.log('✅ Auth provider initialized');
				} else {
					console.log('⚠️ Clerk not yet loaded or getToken not available');
				}
			} catch (error) {
				console.log("Errore in AuthProvider", error);
			} finally {
				setLoading(false);
			}
		};

		initAuth();
	}, [getToken, isLoaded]);

	if (loading) {
		return (
			<div className="h-screen w-full flex items-center justify-center">
				<Loader className="size-8 text-emerald-500 animate-spin" />
			</div>
		);
	}

	return <>{children}</>;
};

export default AuthProvider;
