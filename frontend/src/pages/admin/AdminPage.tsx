import { useAuthStore } from "@/stores/useAuthStore";
import { useAuth } from '@clerk/clerk-react';
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Album, Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";

const AdminPage = () => {
	const { isSignedIn, isLoaded } = useAuth();
	const { isAdmin, isLoading, checkAdminStatus } = useAuthStore();
	const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

	useEffect(() => {
		if (isSignedIn && isLoaded) {
			checkAdminStatus();
		}
	}, [checkAdminStatus, isSignedIn, isLoaded]);

	useEffect(() => {
		if (isAdmin) {
			fetchAlbums();
			fetchSongs();
			fetchStats();
		}
	}, [isAdmin, fetchAlbums, fetchSongs, fetchStats]);

	// Show loading while Clerk is checking authentication or while checking admin status
	if (!isSignedIn || isLoading) {
		return (
			<div className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4'></div>
					<p className='text-zinc-400'>
						{!isSignedIn ? 'Verifica autenticazione...' : 'Controllo permessi amministratore...'}
					</p>
				</div>
			</div>
		);
	}

	if (!isAdmin) {
		return (
			<div className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 flex items-center justify-center'>
				<div className='text-center max-w-md mx-auto p-8'>
					<div className='text-red-500 text-6xl mb-4'>🚫</div>
					<h1 className='text-2xl font-bold text-white mb-2'>Accesso Negato</h1>
					<p className='text-zinc-400 mb-6'>
						Non hai i permessi necessari per accedere alla dashboard amministratore.
					</p>
					<div className='space-y-2 text-sm text-zinc-500'>
						<p>• Solo gli amministratori possono accedere a questa sezione</p>
						<p>• Assicurati di aver fatto il login con l'account corretto</p>
					</div>
					<button 
						onClick={() => window.location.href = '/'}
						className='mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
					>
						Torna alla Home
					</button>
				</div>
			</div>
		);
	}

	return (
		<div
			className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900
   to-black text-zinc-100 p-8'
		>
			<Header />

			<DashboardStats />

			<Tabs defaultValue='songs' className='space-y-6'>
				<TabsList className='p-1 bg-zinc-800/50'>
					<TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700'>
						<Music className='mr-2 size-4' />
						Canzoni
					</TabsTrigger>
					<TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700'>
						<Album className='mr-2 size-4' />
						Album
					</TabsTrigger>
				</TabsList>

				<TabsContent value='songs'>
					<SongsTabContent />
				</TabsContent>
				<TabsContent value='albums'>
					<AlbumsTabContent />
				</TabsContent>
			</Tabs>
		</div>
	);
};
export default AdminPage;
