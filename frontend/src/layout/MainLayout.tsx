import { Outlet } from "react-router-dom";
import {
	ResizablePanelGroup,
	ResizablePanel,
	ResizableHandle,
} from "@/components/ui/resizable";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MainLayout = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const { user } = useUser();
	const { initSocket, disconnectSocket } = useChatStore();

	// Detect screen size
	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const isMobile = windowWidth < 768;
	const isTablet = windowWidth >= 768 && windowWidth < 1024;

	useEffect(() => {
		if (user?.id) {
			initSocket(user.id);
		}

		return () => {
			disconnectSocket();
		};
	}, [user?.id, initSocket, disconnectSocket]);

	// Mobile Layout
	if (isMobile) {
		return (
			<ErrorBoundary>
				<div className="h-screen bg-gradient-to-br from-background via-background to-secondary text-foreground flex flex-col relative overflow-hidden">
					{/* Mobile Header */}
					<div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-md border-b border-white/10">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="text-white hover:bg-white/10"
						>
							{isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
						</Button>
						<h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
							Spotify Clone
						</h1>
						<div className="w-10" /> {/* Spacer */}
					</div>

					{/* Mobile Sidebar Overlay */}
					{isMobileMenuOpen && (
						<>
							<div 
								className="fixed inset-0 bg-black/50 z-40" 
								onClick={() => setIsMobileMenuOpen(false)}
							/>
							<div className="fixed left-0 top-0 h-full w-80 bg-zinc-900/95 backdrop-blur-md z-50 transform transition-transform duration-300">
								<div className="h-full overflow-hidden">
									<ErrorBoundary>
										<LeftSidebar />
									</ErrorBoundary>
								</div>
							</div>
						</>
					)}

					{/* Main Content */}
					<div className="flex-1 overflow-hidden p-2">
						<div className="h-full glass-card rounded-2xl overflow-hidden">
							<ErrorBoundary>
								<Outlet />
							</ErrorBoundary>
						</div>
					</div>

					{/* Mobile Audio Player */}
					<div className="bg-black/20 backdrop-blur-md border-t border-white/10">
						<ErrorBoundary>
							<AudioPlayer />
						</ErrorBoundary>
					</div>
				</div>
			</ErrorBoundary>
		);
	}

	// Tablet Layout
	if (isTablet) {
		return (
			<ErrorBoundary>
				<div className="h-screen bg-gradient-to-br from-background via-background to-secondary text-foreground flex flex-col relative overflow-hidden">
					{/* Background decorative elements - reduced for tablet */}
					<div className="absolute inset-0 pointer-events-none">
						<div className="absolute top-20 left-10 w-24 h-24 bg-gradient-primary rounded-full blur-3xl opacity-10 animate-float" />
						<div className="absolute bottom-40 right-16 w-32 h-32 bg-gradient-neon rounded-full blur-3xl opacity-10 float-reverse" />
					</div>

					<div className="flex-1 flex h-full overflow-hidden p-3 gap-3">
						{/* Left Sidebar */}
						<div className="w-64 flex-shrink-0">
							<div className="h-full glass-sidebar rounded-2xl overflow-hidden">
								<ErrorBoundary>
									<LeftSidebar />
								</ErrorBoundary>
							</div>
						</div>

						{/* Main Content */}
						<div className="flex-1">
							<div className="h-full glass-card rounded-2xl overflow-hidden">
								<ErrorBoundary>
									<Outlet />
								</ErrorBoundary>
							</div>
						</div>
					</div>

					{/* Audio Player */}
					<div>
						<ErrorBoundary>
							<AudioPlayer />
						</ErrorBoundary>
					</div>
				</div>
			</ErrorBoundary>
		);
	}

	// Desktop Layout (original with resizable panels)
	return (
		<ErrorBoundary>
			<div className="h-screen bg-gradient-to-br from-background via-background to-secondary text-foreground flex flex-col relative overflow-hidden particles">
				{/* Background decorative elements */}
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute top-20 left-20 w-32 h-32 bg-gradient-primary rounded-full blur-3xl opacity-10 animate-float" />
					<div className="absolute bottom-40 right-32 w-48 h-48 bg-gradient-neon rounded-full blur-3xl opacity-10 float-reverse" />
					<div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent/20 rounded-full blur-2xl opacity-20 float-slow" />
				</div>

				<ResizablePanelGroup
					direction="horizontal"
					className="flex-1 flex h-full overflow-hidden p-4 gap-4">
					<ResizablePanel
						defaultSize={20}
						minSize={15}
						maxSize={30}>
						<div className="h-full glass-sidebar rounded-3xl overflow-hidden animate-slide-in-left stagger-1">
							<ErrorBoundary>
								<LeftSidebar />
							</ErrorBoundary>
						</div>
					</ResizablePanel>

					<ResizableHandle className="w-1 bg-transparent hover:bg-border/20 rounded-full transition-all duration-300 mx-2" />

					<ResizablePanel defaultSize={55}>
						<div className="h-full glass-card rounded-3xl overflow-hidden animate-scale-in stagger-2">
							<ErrorBoundary>
								<Outlet />
							</ErrorBoundary>
						</div>
					</ResizablePanel>

					<ResizableHandle className="w-1 bg-transparent hover:bg-border/20 rounded-full transition-all duration-300 mx-2" />

					<ResizablePanel
						defaultSize={25}
						minSize={0}
						maxSize={30}
						collapsedSize={0}>
						<div className="h-full glass-sidebar rounded-3xl overflow-hidden animate-slide-in-right stagger-3">
							<ErrorBoundary>
								<FriendsActivity />
							</ErrorBoundary>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
				
				{/* Audio Player */}
				<div className="animate-slide-in-up stagger-4">
					<ErrorBoundary>
						<AudioPlayer />
					</ErrorBoundary>
				</div>
			</div>
		</ErrorBoundary>
	);
};

export default MainLayout;
