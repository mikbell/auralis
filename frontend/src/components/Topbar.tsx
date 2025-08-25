import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon, Search } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import AdvancedSearch from "./AdvancedSearch";

const Topbar = () => {
	const { isAdmin } = useAuthStore();
	
	return (
		<div
			className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 
      backdrop-blur-md z-10
    '
		>
			<div className='flex gap-2 items-center'>
				<Link to="/" className="flex gap-2 items-center hover:opacity-80 transition-opacity">
					<img src='/auralis.svg' className='size-8' alt='Auralis logo' />
					Auralis
				</Link>
			</div>
			
			{/* Center - Compact Search */}
			<div className="flex-1 max-w-md mx-8">
				<AdvancedSearch 
					compact 
					placeholder="Cerca brani, artisti..."
					onSearchResults={(results) => {
						// Navigate to search page with results if needed
						if (results.total > 0) {
							// Optional: navigate to search page
							// navigate('/search');
						}
					}}
				/>
			</div>
			
			<div className='flex items-center gap-4'>
				{/* Advanced Search Link */}
				<Link to="/search" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:flex")}>
					<Search className='size-4 mr-2' />
					Ricerca Avanzata
				</Link>
				
				{isAdmin && (
					<Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))}>
						<LayoutDashboardIcon className='size-4  mr-2' />
						Admin Dashboard
					</Link>
				)}

				<SignedOut>
					<SignInOAuthButtons />
				</SignedOut>

				<UserButton />
			</div>
		</div>
	);
};
export default Topbar;
