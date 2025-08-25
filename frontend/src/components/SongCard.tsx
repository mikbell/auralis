import React, { memo, useMemo, useCallback } from 'react';
import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { cn } from '@/lib/utils';
import type { Song } from '@/types';
import { 
	DropdownMenu, 
	DropdownMenuContent, 
	DropdownMenuItem, 
	DropdownMenuSeparator, 
	DropdownMenuTrigger 
} from './ui/dropdown-menu';

interface SongCardProps {
	song: Song;
	index?: number;
	showIndex?: boolean;
	onLike?: (songId: string) => void;
	onAddToQueue?: (song: Song) => void;
	onAddToPlaylist?: (song: Song) => void;
	isLiked?: boolean;
	className?: string;
}

const SongCard: React.FC<SongCardProps> = memo(({
	song,
	index,
	showIndex = false,
	onLike,
	onAddToQueue,
	onAddToPlaylist,
	isLiked = false,
	className
}) => {
	const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();

	// Memoized values
	const isCurrentSong = useMemo(() => 
		currentSong?._id === song._id, 
		[currentSong?._id, song._id]
	);

	const isCurrentlyPlaying = useMemo(() => 
		isCurrentSong && isPlaying, 
		[isCurrentSong, isPlaying]
	);

	const formattedDuration = useMemo(() => {
		const minutes = Math.floor(song.duration / 60);
		const seconds = Math.floor(song.duration % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}, [song.duration]);

	// Memoized callbacks
	const handlePlayPause = useCallback(() => {
		if (isCurrentSong) {
			togglePlay();
		} else {
			setCurrentSong(song);
		}
	}, [isCurrentSong, togglePlay, setCurrentSong, song]);

	const handleLike = useCallback(() => {
		onLike?.(song._id);
	}, [onLike, song._id]);

	const handleAddToQueue = useCallback(() => {
		onAddToQueue?.(song);
	}, [onAddToQueue, song]);

	const handleAddToPlaylist = useCallback(() => {
		onAddToPlaylist?.(song);
	}, [onAddToPlaylist, song]);

	return (
		<div 
			className={cn(
				'group card-modern glass-card flex items-center space-x-4 p-4 hover:neon-glow transition-all duration-500 hover:scale-[1.02] border border-border/20 hover:border-primary/30 relative overflow-hidden',
				className
			)}
		>
			{/* Index/Play Button */}
			<div className="w-8 h-8 flex items-center justify-center relative">
				{showIndex && !isCurrentlyPlaying && (
					<span className="text-muted-foreground text-sm group-hover:hidden">
						{index}
					</span>
				)}
				<Button
					variant="ghost"
					size="sm"
					onClick={handlePlayPause}
					className={cn(
						'w-8 h-8 p-0 rounded-full bg-gradient-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 btn-glow',
						isCurrentlyPlaying && 'opacity-100 neon-glow pulse-glow'
					)}
				>
					{isCurrentlyPlaying ? 
						<Pause className="w-4 h-4 animate-pulse" /> : 
						<Play className="w-4 h-4" />
					}
				</Button>
			</div>

			{/* Song Image */}
			<div className="w-12 h-12 flex-shrink-0 relative overflow-hidden rounded-xl group-hover:shadow-lg transition-all duration-300">
				<img
					src={song.imageUrl}
					alt={song.title}
					className="w-full h-full object-cover rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
					loading="lazy"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			</div>

			{/* Song Info */}
			<div className="flex-1 min-w-0 transition-all duration-300">
				<p className={cn(
					'font-semibold truncate transition-all duration-300 group-hover:gradient-text-primary',
					isCurrentlyPlaying && 'gradient-text-neon animate-pulse-custom'
				)}>
					{song.title}
				</p>
				<p className="text-sm text-muted-foreground truncate transition-all duration-300 group-hover:text-accent">
					{song.artist}
				</p>
				{/* Animated music visualizer when playing */}
				{isCurrentlyPlaying && (
					<div className="audio-visualizer mt-1">
						<div className="audio-bar" />
						<div className="audio-bar" />
						<div className="audio-bar" />
						<div className="audio-bar" />
					</div>
				)}
			</div>

			{/* Album Info (if available) */}
			{song.album && (
				<div className="hidden md:block flex-1 min-w-0">
					<p className="text-sm text-muted-foreground truncate">
						{song.album.title}
					</p>
				</div>
			)}

			{/* Actions */}
			<div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
				{/* Like Button */}
				<Button
					variant="ghost"
					size="sm"
					onClick={handleLike}
					className={cn(
						'p-2 glass-button hover:neon-accent transition-all duration-300',
						isLiked && 'text-red-500 neon-accent opacity-100 animate-pulse-custom'
					)}
				>
					<Heart className={cn('w-4 h-4 transition-all duration-300', isLiked && 'fill-current scale-110')} />
				</Button>

				{/* Duration */}
				<span className="text-sm text-muted-foreground min-w-[3rem] text-right font-mono transition-all duration-300 group-hover:text-primary">
					{formattedDuration}
				</span>

				{/* More Options */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" className="p-2 glass-button hover:neon-glow transition-all duration-300">
							<MoreHorizontal className="w-4 h-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={handleAddToQueue}>
							Aggiungi alla coda
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleAddToPlaylist}>
							Aggiungi a playlist
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							Vai all'artista
						</DropdownMenuItem>
						<DropdownMenuItem>
							Vai all'album
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
});

SongCard.displayName = 'SongCard';

export default SongCard;
