import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
	Play, 
	Pause, 
	SkipBack, 
	SkipForward, 
	Volume2, 
	VolumeX, 
	Shuffle, 
	Repeat, 
	Heart,
	MoreHorizontal,
	Maximize2,
	Minimize2
} from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { 
	Tooltip, 
	TooltipContent, 
	TooltipProvider, 
	TooltipTrigger 
} from './ui/tooltip';

interface AudioPlayerProps {
	className?: string;
	compact?: boolean;
}

type RepeatMode = 'off' | 'all' | 'one';

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
	className, 
	compact = false 
}) => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(1);
	const [previousVolume, setPreviousVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [isShuffled, setIsShuffled] = useState(false);
	const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
	const [isLiked, setIsLiked] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);

	const { 
		currentSong, 
		isPlaying, 
		togglePlay, 
		playNext, 
		playPrevious,
		queue,
		currentIndex
	} = usePlayerStore();

	// Audio event handlers
	const handleLoadedMetadata = useCallback(() => {
		if (audioRef.current) {
			setDuration(audioRef.current.duration);
		}
	}, []);

	const handleTimeUpdate = useCallback(() => {
		if (audioRef.current) {
			setCurrentTime(audioRef.current.currentTime);
		}
	}, []);

	const handleEnded = useCallback(() => {
		if (repeatMode === 'one') {
			// Repeat current song
			if (audioRef.current) {
				audioRef.current.currentTime = 0;
				audioRef.current.play();
			}
		} else if (repeatMode === 'all' || currentIndex < queue.length - 1) {
			// Play next song
			playNext();
		} else {
			// Stop playing
			togglePlay();
		}
	}, [repeatMode, currentIndex, queue.length, playNext, togglePlay]);

	// Effects
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		audio.addEventListener('loadedmetadata', handleLoadedMetadata);
		audio.addEventListener('timeupdate', handleTimeUpdate);
		audio.addEventListener('ended', handleEnded);

		return () => {
			audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
			audio.removeEventListener('timeupdate', handleTimeUpdate);
			audio.removeEventListener('ended', handleEnded);
		};
	}, [handleLoadedMetadata, handleTimeUpdate, handleEnded]);

	useEffect(() => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.play().catch(console.error);
		} else {
			audioRef.current.pause();
		}
	}, [isPlaying]);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = isMuted ? 0 : volume;
		}
	}, [volume, isMuted]);

	// Control handlers
	const handleSeek = (value: number[]) => {
		const time = (value[0] / 100) * duration;
		if (audioRef.current) {
			audioRef.current.currentTime = time;
		}
		setCurrentTime(time);
	};

	const handleVolumeChange = (value: number[]) => {
		const newVolume = value[0] / 100;
		setVolume(newVolume);
		if (newVolume > 0 && isMuted) {
			setIsMuted(false);
		}
	};

	const toggleMute = () => {
		if (isMuted) {
			setIsMuted(false);
			setVolume(previousVolume);
		} else {
			setPreviousVolume(volume);
			setIsMuted(true);
		}
	};

	const toggleShuffle = () => {
		setIsShuffled(!isShuffled);
		// TODO: Implement shuffle logic in store
	};

	const cycleRepeat = () => {
		const modes: RepeatMode[] = ['off', 'all', 'one'];
		const currentIndex = modes.indexOf(repeatMode);
		const nextIndex = (currentIndex + 1) % modes.length;
		setRepeatMode(modes[nextIndex]);
	};

	const toggleLike = () => {
		setIsLiked(!isLiked);
		// TODO: Implement like functionality
	};

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};

	if (!currentSong) {
		return null;
	}

	if (compact) {
		return (
			<div className={cn('flex items-center space-x-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60', className)}>
				<audio ref={audioRef} src={currentSong.audioUrl} preload="metadata" />
				
				{/* Song Info */}
				<div className="flex items-center space-x-3 min-w-0 flex-1">
					<img 
						src={currentSong.imageUrl} 
						alt={currentSong.title}
						className="w-12 h-12 rounded object-cover"
					/>
					<div className="min-w-0">
						<p className="font-medium truncate">{currentSong.title}</p>
						<p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={toggleLike}
						className={cn(isLiked && 'text-red-500')}
					>
						<Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
					</Button>
				</div>

				{/* Controls */}
				<div className="flex items-center space-x-2">
					<Button variant="ghost" size="sm" onClick={playPrevious}>
						<SkipBack className="w-4 h-4" />
					</Button>
					<Button variant="ghost" size="sm" onClick={togglePlay}>
						{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
					</Button>
					<Button variant="ghost" size="sm" onClick={playNext}>
						<SkipForward className="w-4 h-4" />
					</Button>
				</div>

				{/* Progress */}
				<div className="flex items-center space-x-2 w-32">
					<span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
					<Slider
						value={[duration ? (currentTime / duration) * 100 : 0]}
						onValueChange={handleSeek}
						className="flex-1"
						step={0.1}
					/>
					<span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
				</div>

				{/* Volume */}
				<div className="flex items-center space-x-2">
					<Button variant="ghost" size="sm" onClick={toggleMute}>
						{isMuted || volume === 0 ? 
							<VolumeX className="w-4 h-4" /> : 
							<Volume2 className="w-4 h-4" />
						}
					</Button>
					<Slider
						value={[isMuted ? 0 : volume * 100]}
						onValueChange={handleVolumeChange}
						className="w-20"
					/>
				</div>
			</div>
		);
	}

	// Mobile layout (simplified)
	if (window.innerWidth < 768) {
		return (
			<div className={cn(
				'fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 z-50',
				className
			)}>
				<audio ref={audioRef} src={currentSong.audioUrl} preload="metadata" />

				{/* Mobile Progress Bar */}
				<div className="px-4 pt-2">
					<Slider
						value={[duration ? (currentTime / duration) * 100 : 0]}
						onValueChange={handleSeek}
						className="w-full"
						step={0.1}
					/>
				</div>

				{/* Mobile Player Content */}
				<div className="flex items-center justify-between p-4">
					{/* Song Info */}
					<div className="flex items-center space-x-3 flex-1 min-w-0">
						<img 
							src={currentSong.imageUrl} 
							alt={currentSong.title}
							className="w-12 h-12 rounded-lg object-cover"
						/>
						<div className="min-w-0 flex-1">
							<p className="font-semibold truncate text-white text-sm">{currentSong.title}</p>
							<p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
						</div>
					</div>

					{/* Mobile Controls */}
					<div className="flex items-center space-x-4">
						<Button
							variant="ghost"
							size="sm"
							onClick={toggleLike}
							className={cn(isLiked && 'text-red-500')}
						>
							<Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
						</Button>
						<Button variant="ghost" size="sm" onClick={playPrevious}>
							<SkipBack className="w-5 h-5" />
						</Button>
						<Button 
							variant="default" 
							size="sm" 
							onClick={togglePlay}
							className="w-10 h-10 rounded-full bg-white hover:bg-gray-200 text-black"
						>
							{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
						</Button>
						<Button variant="ghost" size="sm" onClick={playNext}>
							<SkipForward className="w-5 h-5" />
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<TooltipProvider>
			<div className={cn(
				'fixed bottom-4 left-4 right-4 glass-player rounded-3xl border border-border/20 z-50 animate-slide-in-up transition-all duration-500',
				isExpanded && 'h-96',
				className
			)}>
				<audio ref={audioRef} src={currentSong.audioUrl} preload="metadata" />

				{/* Desktop/Tablet Player */}
				<div className="flex items-center justify-between p-6">
					{/* Song Info */}
					<div className="flex items-center space-x-4 flex-1 min-w-0">
						<div className="relative group">
							<img 
								src={currentSong.imageUrl} 
								alt={currentSong.title}
								className="w-16 h-16 rounded-2xl object-cover transition-all duration-500 group-hover:scale-110 morph-blob shadow-lg"
							/>
							<div className="absolute inset-0 bg-gradient-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
							{/* Animated border */}
							<div className="absolute -inset-0.5 bg-gradient-neon rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin" style={{animationDuration: '8s'}} />
						</div>
						<div className="min-w-0">
							<p className="font-bold truncate gradient-text-aurora text-lg animate-fade-in">{currentSong.title}</p>
							<p className="text-sm text-muted-foreground truncate transition-colors duration-300 hover:text-accent">{currentSong.artist}</p>
						</div>
						<div className="flex items-center space-x-3">
							<Button
								variant="ghost"
								size="sm"
								onClick={toggleLike}
								className={cn(
									'glass-button hover:neon-accent transition-all duration-300 p-3',
									isLiked && 'text-red-500 neon-accent animate-pulse-custom'
								)}
							>
								<Heart className={cn('w-5 h-5 transition-all duration-300', isLiked && 'fill-current scale-110')} />
							</Button>
							<Button variant="ghost" size="sm" className="glass-button hover:neon-glow p-3">
								<MoreHorizontal className="w-5 h-5" />
							</Button>
							{/* Audio visualizer */}
							{isPlaying && (
								<div className="audio-visualizer">
									<div className="audio-bar" />
									<div className="audio-bar" />
									<div className="audio-bar" />
									<div className="audio-bar" />
									<div className="audio-bar" />
								</div>
							)}
						</div>
					</div>

					{/* Center Controls */}
					<div className="flex flex-col items-center space-y-3 flex-1 max-w-lg">
						<div className="flex items-center space-x-6">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button 
										variant="ghost" 
										size="sm" 
										onClick={toggleShuffle}
										className={cn(
											'glass-button hover:neon-glow transition-all duration-300 p-2',
											isShuffled && 'text-primary neon-glow'
										)}
									>
										<Shuffle className="w-5 h-5" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									{isShuffled ? 'Disabilita riproduzione casuale' : 'Abilita riproduzione casuale'}
								</TooltipContent>
							</Tooltip>

							<Button 
								variant="ghost" 
								size="sm" 
								onClick={playPrevious}
								className="glass-button hover:neon-glow transition-all duration-300 p-2 hover:scale-110"
							>
								<SkipBack className="w-6 h-6" />
							</Button>

							<Button 
								variant="default" 
								size="sm" 
								onClick={togglePlay}
								className="w-12 h-12 rounded-full bg-gradient-primary hover:bg-gradient-secondary neon-glow hover:scale-110 transition-all duration-300 btn-glow"
							>
								{isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
							</Button>

							<Button 
								variant="ghost" 
								size="sm" 
								onClick={playNext}
								className="glass-button hover:neon-glow transition-all duration-300 p-2 hover:scale-110"
							>
								<SkipForward className="w-6 h-6" />
							</Button>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button 
										variant="ghost" 
										size="sm" 
										onClick={cycleRepeat}
										className={cn(
											'glass-button hover:neon-glow transition-all duration-300 p-2 relative',
											repeatMode !== 'off' && 'text-primary neon-glow'
										)}
									>
										<Repeat className="w-5 h-5" />
										{repeatMode === 'one' && (
											<Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 text-xs bg-gradient-primary neon-accent">1</Badge>
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									Ripeti: {repeatMode === 'off' ? 'No' : repeatMode === 'all' ? 'Tutto' : 'Brano'}
								</TooltipContent>
							</Tooltip>
						</div>

						{/* Progress Bar */}
						<div className="flex items-center space-x-4 w-full">
							<span className="text-xs text-muted-foreground w-12 text-right font-mono gradient-text-primary">
								{formatTime(currentTime)}
							</span>
							<div className="flex-1 relative">
								<Slider
									value={[duration ? (currentTime / duration) * 100 : 0]}
									onValueChange={handleSeek}
									className="flex-1 slider-glow"
									step={0.1}
								/>
								{/* Progress glow effect */}
								<div 
									className="absolute top-1/2 left-0 h-1 bg-gradient-neon rounded-full -translate-y-1/2 transition-all duration-300"
									style={{width: `${duration ? (currentTime / duration) * 100 : 0}%`}}
								/>
							</div>
							<span className="text-xs text-muted-foreground w-12 font-mono gradient-text-primary">
								{formatTime(duration)}
							</span>
						</div>
					</div>

					{/* Right Controls */}
					<div className="flex items-center space-x-4 flex-1 justify-end">
						<div className="flex items-center space-x-3">
							<Button 
								variant="ghost" 
								size="sm" 
								onClick={toggleMute}
								className="glass-button hover:neon-glow transition-all duration-300 p-2"
							>
								{isMuted || volume === 0 ? 
									<VolumeX className="w-5 h-5" /> : 
									<Volume2 className="w-5 h-5" />
								}
							</Button>
							<div className="relative w-28">
								<Slider
									value={[isMuted ? 0 : volume * 100]}
									onValueChange={handleVolumeChange}
									className="slider-glow"
								/>
								{/* Volume glow effect */}
								<div 
									className="absolute top-1/2 left-0 h-1 bg-gradient-accent rounded-full -translate-y-1/2 transition-all duration-300"
									style={{width: `${isMuted ? 0 : volume * 100}%`}}
								/>
							</div>
						</div>
						
						<Button 
							variant="ghost" 
							size="sm"
							onClick={() => setIsExpanded(!isExpanded)}
							className="glass-button hover:neon-glow transition-all duration-300 p-2 hover:scale-110"
						>
							{isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
						</Button>
					</div>
				</div>

				{/* Expanded Queue View */}
				{isExpanded && (
					<div className="border-t p-4 h-80 overflow-y-auto">
					<h3 className="font-medium mb-4">Coda di riproduzione</h3>
						{queue.map((song, index) => (
							<div 
								key={song._id}
								className={cn(
									'flex items-center space-x-3 p-2 rounded hover:bg-muted/50 cursor-pointer',
									index === currentIndex && 'bg-muted'
								)}
							>
								<span className="w-4 text-sm text-muted-foreground">
									{index + 1}
								</span>
								<img 
									src={song.imageUrl} 
									alt={song.title}
									className="w-8 h-8 rounded object-cover"
								/>
								<div className="flex-1 min-w-0">
									<p className="font-medium truncate text-sm">{song.title}</p>
									<p className="text-xs text-muted-foreground truncate">{song.artist}</p>
								</div>
								<span className="text-xs text-muted-foreground">
									{formatTime(song.duration || 0)}
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		</TooltipProvider>
	);
};
