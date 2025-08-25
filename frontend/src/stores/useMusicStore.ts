import { axiosInstance } from "@/lib/axios";
import type { Album, Song, Stats } from "@/types";
import { showToast, ToastMessages } from "@/components/Toast";
import { create } from "zustand";

interface SearchResults {
	songs: Song[];
	albums: Album[];
	artists: { _id: string; artist: string; songCount: number; totalPlays: number; imageUrl?: string; }[];
	total: number;
}

interface QuickSearchSuggestion {
	type: 'song' | 'artist';
	id: string;
	title: string;
	artist: string;
	imageUrl?: string;
}

interface MusicStore {
	songs: Song[];
	albums: Album[];
	isLoading: boolean;
	error: string | null;
	currentAlbum: Album | null;
	featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];
	stats: Stats;
	
	// Search state
	searchResults: SearchResults;
	isSearching: boolean;
	searchQuery: string;
	quickSearchSuggestions: QuickSearchSuggestion[];
	recentSearches: string[];

	fetchAlbums: () => Promise<void>;
	fetchAlbumById: (id: string) => Promise<void>;
	fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	fetchSongs: () => Promise<void>;
	deleteSong: (id: string) => Promise<void>;
	deleteAlbum: (id: string) => Promise<void>;
	
	// Search functions
	searchMusic: (query: string, filters?: { type?: string; genre?: string; artist?: string; limit?: number; offset?: number }) => Promise<void>;
	quickSearch: (query: string, limit?: number) => Promise<void>;
	clearSearchResults: () => void;
	addToRecentSearches: (query: string) => void;
	clearRecentSearches: () => void;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
	albums: [],
	songs: [],
	isLoading: false,
	error: null,
	currentAlbum: null,
	madeForYouSongs: [],
	featuredSongs: [],
	trendingSongs: [],
	stats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalArtists: 0,
	},
	
	// Search state
	searchResults: {
		songs: [],
		albums: [],
		artists: [],
		total: 0
	},
	isSearching: false,
	searchQuery: '',
	quickSearchSuggestions: [],
	recentSearches: JSON.parse(localStorage.getItem('recentSearches') || '[]'),

	deleteSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/songs/${id}`);

			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));
		showToast.success(ToastMessages.deleted);
		} catch (error: any) {
			console.log("Error in deleteSong", error);
		showToast.error('Errore durante l\'eliminazione del brano');
		} finally {
			set({ isLoading: false });
		}
	},

	deleteAlbum: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/albums/${id}`);
		set((state) => {
			const albumToDelete = state.albums.find(a => a._id === id);
			return {
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) =>
					song.albumId === albumToDelete?._id ? { ...song, albumId: null, album: undefined } : song
				),
			};
		});
		showToast.success('Album eliminato con successo');
		} catch (error: any) {
		showToast.error('Errore durante l\'eliminazione dell\'album: ' + error.message);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs");
			// Gestisce sia il nuovo formato API che quello vecchio
			const songs = response.data?.data || response.data || [];
			set({ songs });
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || 'Errore nel caricamento brani';
			set({ error: errorMessage });
			showToast.error(errorMessage);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/stats");
			// Gestisce sia il nuovo formato API che quello vecchio
			const stats = response.data?.data || response.data || {
				totalSongs: 0,
				totalAlbums: 0,
				totalUsers: 0,
				totalArtists: 0
			};
			set({ stats });
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || 'Errore nel caricamento statistiche';
			set({ error: errorMessage });
			showToast.error(errorMessage);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbums: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/albums");
			// Gestisce sia il nuovo formato API che quello vecchio
			const albums = response.data?.data || response.data || [];
			set({ albums });
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || 'Errore nel caricamento album';
			set({ error: errorMessage });
			showToast.error(errorMessage);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbumById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/albums/${id}`);
			// Gestisce sia il nuovo formato API che quello vecchio
			const currentAlbum = response.data?.data || response.data;
			set({ currentAlbum });
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || 'Errore nel caricamento album';
			set({ error: errorMessage });
			showToast.error(errorMessage);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchFeaturedSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/featured");
			// Gestisce sia il nuovo formato API che quello vecchio
			const featuredSongs = response.data?.data || response.data || [];
			set({ featuredSongs });
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || 'Errore nel caricamento brani in evidenza';
			set({ error: errorMessage });
			showToast.error(errorMessage);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMadeForYouSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/made-for-you");
			// Gestisce sia il nuovo formato API che quello vecchio
			const madeForYouSongs = response.data?.data || response.data || [];
			set({ madeForYouSongs });
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || 'Errore nel caricamento brani personalizzati';
			set({ error: errorMessage });
			showToast.error(errorMessage);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchTrendingSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/trending");
			// Gestisce sia il nuovo formato API che quello vecchio
			const trendingSongs = response.data?.data || response.data || [];
			set({ trendingSongs });
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || 'Errore nel caricamento tendenze';
			set({ error: errorMessage });
			showToast.error(errorMessage);
		} finally {
			set({ isLoading: false });
		}
	},

	// Search functions
	searchMusic: async (query, filters = {}) => {
		if (!query.trim()) {
			set({ searchResults: { songs: [], albums: [], artists: [], total: 0 } });
			return;
		}

		set({ isSearching: true, error: null, searchQuery: query });
		
		try {
		const params = new URLSearchParams();
		params.append('q', query.trim());
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined) {
				params.append(key, String(value));
			}
		});

			const response = await axiosInstance.get(`/songs/search?${params}`);
			const searchResults = response.data?.data || {
				songs: [],
				albums: [],
				artists: [],
				total: 0
			};

			set({ searchResults });
			
			// Add to recent searches
			get().addToRecentSearches(query.trim());
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || 'Errore durante la ricerca';
			set({ 
				error: errorMessage,
				searchResults: { songs: [], albums: [], artists: [], total: 0 }
			});
			showToast.error(errorMessage);
		} finally {
			set({ isSearching: false });
		}
	},

	quickSearch: async (query, limit = 5) => {
		if (!query.trim() || query.trim().length < 2) {
			set({ quickSearchSuggestions: [] });
			return;
		}

		try {
			const params = new URLSearchParams({
				q: query.trim(),
				limit: limit.toString()
			});

			const response = await axiosInstance.get(`/songs/search/quick?${params}`);
			const suggestions = response.data?.data?.suggestions || [];

			set({ quickSearchSuggestions: suggestions });
		} catch (error: any) {
			console.error('Quick search error:', error);
			set({ quickSearchSuggestions: [] });
		}
	},

	clearSearchResults: () => {
		set({ 
			searchResults: { songs: [], albums: [], artists: [], total: 0 },
			searchQuery: '',
			quickSearchSuggestions: [],
			error: null
		});
	},

	addToRecentSearches: (query) => {
		const currentSearches = get().recentSearches;
		const trimmedQuery = query.trim().toLowerCase();
		
		// Remove if already exists
		const filtered = currentSearches.filter(search => 
			search.toLowerCase() !== trimmedQuery
		);
		
		// Add to beginning and limit to 10
		const newSearches = [query.trim(), ...filtered].slice(0, 10);
		
		set({ recentSearches: newSearches });
		localStorage.setItem('recentSearches', JSON.stringify(newSearches));
	},

	clearRecentSearches: () => {
		set({ recentSearches: [] });
		localStorage.removeItem('recentSearches');
	},
}));
