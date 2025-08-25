import React, { memo, useMemo, useCallback, useState } from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  MoreHorizontal, 
  Plus, 
  Download, 
  Share2,
  User,
  Disc3,
  Clock
} from 'lucide-react';

import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup
} from './ui/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './ui/hover-card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuShortcut,
} from './ui/context-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

import { usePlayerStore } from '@/stores/usePlayerStore';
import { cn } from '@/lib/utils';
import type { Song } from '@/types';

interface SongCardOptimizedProps {
  song: Song;
  index?: number;
  showIndex?: boolean;
  onLike?: (songId: string) => void;
  onAddToQueue?: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  onDownload?: (song: Song) => void;
  onShare?: (song: Song) => void;
  isLiked?: boolean;
  isDownloading?: boolean;
  downloadProgress?: number;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

const SongCardOptimized: React.FC<SongCardOptimizedProps> = memo(({
  song,
  index,
  showIndex = false,
  onLike,
  onAddToQueue,
  onAddToPlaylist,
  onDownload,
  onShare,
  isLiked = false,
  isDownloading = false,
  downloadProgress = 0,
  className,
  variant = 'default'
}) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
  const [imageError, setImageError] = useState(false);

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

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(song._id);
  }, [onLike, song._id]);

  const handleAddToQueue = useCallback(() => {
    onAddToQueue?.(song);
  }, [onAddToQueue, song]);

  const handleAddToPlaylist = useCallback(() => {
    onAddToPlaylist?.(song);
  }, [onAddToPlaylist, song]);

  const handleDownload = useCallback(() => {
    onDownload?.(song);
  }, [onDownload, song]);

  const handleShare = useCallback(() => {
    onShare?.(song);
  }, [onShare, song]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Artist preview component for HoverCard
  const ArtistPreview = ({ artistName }: { artistName: string }) => (
    <div className="flex items-center space-x-3 p-2">
      <Avatar className="h-12 w-12">
        <AvatarImage src={`/artists/${artistName.toLowerCase().replace(' ', '-')}.jpg`} />
        <AvatarFallback>
          <User className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{artistName}</p>
        <p className="text-sm text-muted-foreground">Artista</p>
      </div>
    </div>
  );

  // Compact variant
  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <div className={cn(
          'flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors group',
          className
        )}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePlayPause}
            className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isCurrentlyPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <img
            src={song.imageUrl}
            alt={song.title}
            className="w-8 h-8 rounded object-cover"
            onError={handleImageError}
          />
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{song.title}</p>
            <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleLike}>
                <Heart className={cn('w-4 h-4', isLiked && 'fill-current text-red-500')} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isLiked ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    );
  }

  // Main card component
  const CardContent = (
    <div 
      className={cn(
        'group flex items-center space-x-4 p-4 rounded-lg transition-all duration-300',
        'hover:bg-accent/50 hover:shadow-md cursor-pointer',
        'border border-transparent hover:border-border/50',
        isCurrentlyPlaying && 'bg-accent/30 border-primary/30',
        className
      )}
      onClick={handlePlayPause}
    >
      {/* Index/Play Button */}
      <div className="w-10 h-10 flex items-center justify-center relative flex-shrink-0">
        {showIndex && !isCurrentlyPlaying && (
          <span className="text-muted-foreground text-sm group-hover:hidden">
            {index}
          </span>
        )}
        <Button
          variant={isCurrentlyPlaying ? "default" : "ghost"}
          size="sm"
          className={cn(
            'w-10 h-10 p-0 rounded-full transition-all duration-200',
            isCurrentlyPlaying 
              ? 'opacity-100 bg-primary hover:bg-primary/90' 
              : 'opacity-0 group-hover:opacity-100 bg-primary/90 hover:bg-primary text-primary-foreground'
          )}
          onClick={(e) => {
            e.stopPropagation();
            handlePlayPause();
          }}
        >
          {isCurrentlyPlaying ? 
            <Pause className="w-5 h-5" /> : 
            <Play className="w-5 h-5 ml-0.5" />
          }
        </Button>
      </div>

      {/* Song Image with error handling */}
      <div className="w-14 h-14 flex-shrink-0 relative">
        {!imageError ? (
          <img
            src={song.imageUrl}
            alt={song.title}
            className="w-full h-full object-cover rounded-md"
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
            <Disc3 className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
        
        {/* Download progress overlay */}
        {isDownloading && (
          <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
            <div className="w-8 h-8 relative">
              <Progress value={downloadProgress} className="w-full h-1" />
              <span className="text-xs text-white font-medium">
                {Math.round(downloadProgress)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Song Info with HoverCard for artist */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'font-medium truncate text-base',
          isCurrentlyPlaying && 'text-primary'
        )}>
          {song.title}
        </p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground">
              {song.artist}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <ArtistPreview artistName={song.artist} />
          </HoverCardContent>
        </HoverCard>
        
        {/* Additional info for detailed variant */}
        {variant === 'detailed' && song.album && (
          <p className="text-xs text-muted-foreground truncate mt-1">
            Da: {song.album.title}
          </p>
        )}
      </div>

      {/* Album Info (hidden on mobile) */}
      {song.album && (variant === 'default' || variant === 'detailed') && (
        <div className="hidden md:block flex-1 min-w-0">
          <p className="text-sm text-muted-foreground truncate">
            {song.album.title}
          </p>
        </div>
      )}

      {/* Quality Badge */}
      {song.quality && (
        <Badge variant="secondary" className="text-xs">
          {song.quality}
        </Badge>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-1">
        {/* Like Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                'p-2 opacity-0 group-hover:opacity-100 transition-all',
                isLiked && 'text-red-500 opacity-100'
              )}
            >
              <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isLiked ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
          </TooltipContent>
        </Tooltip>

        {/* Duration */}
        <div className="flex items-center space-x-1 text-sm text-muted-foreground min-w-[3rem]">
          <Clock className="w-3 h-3" />
          <span>{formattedDuration}</span>
        </div>

        {/* More Options Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Opzioni brano</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleAddToQueue}>
                <Plus className="mr-2 h-4 w-4" />
                Aggiungi alla coda
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddToPlaylist}>
                <Plus className="mr-2 h-4 w-4" />
                Aggiungi a playlist
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleDownload} disabled={isDownloading}>
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? 'Download in corso...' : 'Scarica'}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Condividi
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Vai all'artista
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Disc3 className="mr-2 h-4 w-4" />
              Vai all'album
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  // Wrap with ContextMenu for right-click actions
  return (
    <TooltipProvider>
      <ContextMenu>
        <ContextMenuTrigger>
          {CardContent}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Brano: {song.title}</ContextMenuLabel>
          <ContextMenuSeparator />
          
          <ContextMenuItem onClick={handlePlayPause}>
            {isCurrentlyPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isCurrentlyPlaying ? 'Pausa' : 'Riproduci'}
            <ContextMenuShortcut>Space</ContextMenuShortcut>
          </ContextMenuItem>
          
          <ContextMenuItem onClick={handleAddToQueue}>
            <Plus className="mr-2 h-4 w-4" />
            Aggiungi alla coda
            <ContextMenuShortcut>⌘Q</ContextMenuShortcut>
          </ContextMenuItem>
          
          <ContextMenuItem onClick={handleLike}>
            <Heart className={cn('mr-2 h-4 w-4', isLiked && 'fill-current text-red-500')} />
            {isLiked ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
            <ContextMenuShortcut>⌘L</ContextMenuShortcut>
          </ContextMenuItem>
          
          <ContextMenuSeparator />
          
          <ContextMenuItem onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Scarica
          </ContextMenuItem>
          
          <ContextMenuItem onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Condividi
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </TooltipProvider>
  );
});

SongCardOptimized.displayName = 'SongCardOptimized';

export default SongCardOptimized;
