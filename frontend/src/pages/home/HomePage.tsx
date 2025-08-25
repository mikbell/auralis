import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { LoadingSpinner, SongSkeleton } from "@/components/LoadingSpinner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useUser } from "@clerk/clerk-react";
import { getAdvancedGreeting, getPersonalizedSubtitle } from "@/utils/greetingUtils";

const HomePage = () => {
	const {
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchTrendingSongs,
		isLoading,
		madeForYouSongs,
		featuredSongs,
		trendingSongs,
	} = useMusicStore();

	const { initializeQueue } = usePlayerStore();
	
	// Ottieni informazioni utente da Clerk
	const { user, isLoaded } = useUser();
	
	// Generate dynamic subtitle
	const personalizedSubtitle = getPersonalizedSubtitle();

	useEffect(() => {
		fetchFeaturedSongs();
		fetchMadeForYouSongs();
		fetchTrendingSongs();
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

	useEffect(() => {
		if (
			madeForYouSongs.length > 0 &&
			featuredSongs.length > 0 &&
			trendingSongs.length > 0
		) {
			const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
			initializeQueue(allSongs);
		}
	}, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

	return (
		<ErrorBoundary>
			<main className="h-full relative overflow-hidden">
				{/* Dynamic background effects */}
				<div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-background">
					<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float opacity-20" />
					<div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl float-reverse opacity-30" />
					<div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-primary opacity-5 rounded-full blur-2xl float-slow" />
				</div>

				<div className="relative z-10">
					<Topbar />
					<ScrollArea className="h-[calc(100vh-160px)] sm:h-[calc(100vh-180px)]">
						<div className="p-4 sm:p-8 particles">
							<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4 mb-8 md:mb-12">
								<div className="relative w-full md:w-auto">
									<h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-2 gradient-text-aurora animate-fade-in tracking-tight leading-tight">
										{isLoaded ? (
											getAdvancedGreeting(
												user?.firstName || user?.fullName || undefined,
												{ style: 'enthusiastic', includeEmoji: true }
											)
										) : (
											<span className="animate-pulse">Caricamento...</span>
										)}
									</h1>
									<p className="text-muted-foreground text-base sm:text-lg md:text-xl font-medium animate-slide-in-up stagger-1">
										{personalizedSubtitle}
									</p>
									{/* Decorative elements */}
									<div className="absolute -top-4 -left-4 w-2 h-2 bg-accent rounded-full animate-pulse" />
									<div className="absolute top-6 -right-6 w-1 h-1 bg-primary rounded-full animate-pulse" />
								</div>
							</div>

							{isLoading ? (
								<div className="space-y-8">
									<LoadingSpinner
										variant="page"
										message="Caricamento della tua musica..."
									/>
									<div className="space-y-4">
										<SongSkeleton />
										<SongSkeleton />
										<SongSkeleton />
									</div>
								</div>
							) : (
								<>
									<ErrorBoundary>
										<FeaturedSection />
									</ErrorBoundary>

									<div className="space-y-8">
										<ErrorBoundary>
											<SectionGrid
												title="Creato per te"
												songs={madeForYouSongs}
												isLoading={isLoading}
											/>
										</ErrorBoundary>
										<ErrorBoundary>
											<SectionGrid
												title="Tendenze"
												songs={trendingSongs}
												isLoading={isLoading}
											/>
										</ErrorBoundary>
									</div>
								</>
							)}
						</div>
					</ScrollArea>
				</div>
			</main>
		</ErrorBoundary>
	);
};
export default HomePage;
