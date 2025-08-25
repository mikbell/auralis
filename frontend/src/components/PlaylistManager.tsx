import React, { useState, useCallback, useMemo } from 'react';
import {
  Plus,
  Play,
  Music,
  Heart,
  MoreHorizontal,
  Edit,
  Trash2,
  Share2,
  Lock,
  Globe,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Users
} from 'lucide-react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from './ui/dropdown-menu';


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';


import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

import { cn } from '@/lib/utils';

// Types
interface Playlist {
  id: string;
  name: string;
  description?: string;
  cover?: string;
  songCount: number;
  duration: number; // in seconds
  isPublic: boolean;
  isLiked?: boolean;
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  followers?: number;
}

interface PlaylistManagerProps {
  playlists: Playlist[];
  onCreatePlaylist: (playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdatePlaylist: (id: string, updates: Partial<Playlist>) => Promise<void>;
  onDeletePlaylist: (id: string) => Promise<void>;
  onPlayPlaylist: (playlist: Playlist) => void;
  onLikePlaylist: (id: string) => void;
  onSharePlaylist: (playlist: Playlist) => void;
  currentUser: { id: string; name: string; avatar?: string };
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  playlists,
  onCreatePlaylist,
  onUpdatePlaylist,
  onDeletePlaylist,
  onPlayPlaylist,
  onLikePlaylist,
  onSharePlaylist,
  currentUser
}) => {
  // States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'songs' | 'duration'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<'all' | 'mine' | 'liked' | 'public'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create playlist dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [newPlaylistIsPublic, setNewPlaylistIsPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Edit playlist states
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);


  // Utilities
  const formatDuration = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  }, []);

  // Filtered and sorted playlists
  const processedPlaylists = useMemo(() => {
    let filtered = playlists;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(playlist =>
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'mine':
        filtered = filtered.filter(playlist => playlist.creator.id === currentUser.id);
        break;
      case 'liked':
        filtered = filtered.filter(playlist => playlist.isLiked);
        break;
      case 'public':
        filtered = filtered.filter(playlist => playlist.isPublic);
        break;
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'songs':
          comparison = a.songCount - b.songCount;
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [playlists, searchQuery, filterBy, sortBy, sortOrder, currentUser.id]);

  // Handlers
  const handleCreatePlaylist = useCallback(async () => {
    if (!newPlaylistName.trim()) return;

    setIsCreating(true);
    try {
      await onCreatePlaylist({
        name: newPlaylistName.trim(),
        description: newPlaylistDescription.trim() || undefined,
        songCount: 0,
        duration: 0,
        isPublic: newPlaylistIsPublic,
        creator: currentUser,
        tags: [],
      });

      // Reset form
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setNewPlaylistIsPublic(false);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      setIsCreating(false);
    }
  }, [newPlaylistName, newPlaylistDescription, newPlaylistIsPublic, onCreatePlaylist, currentUser]);

  const handleUpdatePlaylist = useCallback(async (playlist: Playlist, updates: Partial<Playlist>) => {
    try {
      await onUpdatePlaylist(playlist.id, updates);
      setEditingPlaylist(null);
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  }, [onUpdatePlaylist]);

  const handleDeletePlaylist = useCallback(async (playlistId: string) => {
    try {
      await onDeletePlaylist(playlistId);
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  }, [onDeletePlaylist]);

  // Playlist Card Component
  const PlaylistCard = ({ playlist }: { playlist: Playlist }) => {
    const isOwner = playlist.creator.id === currentUser.id;
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Card 
        className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          {playlist.cover ? (
            <img 
              src={playlist.cover} 
              alt={playlist.name} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center">
              <Music className="w-16 h-16 text-white/80" />
            </div>
          )}
          
          {/* Play button overlay */}
          <div className={cn(
            "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <Button
              size="lg"
              className="rounded-full w-16 h-16 shadow-2xl"
              onClick={(e) => {
                e.stopPropagation();
                onPlayPlaylist(playlist);
              }}
            >
              <Play className="w-8 h-8 ml-1" />
            </Button>
          </div>

          {/* Privacy indicator */}
          <div className="absolute top-2 right-2">
            <Badge variant={playlist.isPublic ? "default" : "secondary"} className="text-xs">
              {playlist.isPublic ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
              {playlist.isPublic ? 'Pubblica' : 'Privata'}
            </Badge>
          </div>

          {/* Like indicator */}
          {playlist.isLiked && (
            <div className="absolute top-2 left-2">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate text-lg">{playlist.name}</CardTitle>
              <CardDescription className="line-clamp-2 text-sm mt-1">
                {playlist.description || `${playlist.songCount} brani`}
              </CardDescription>
            </div>
            
            {/* More options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Opzioni</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => onPlayPlaylist(playlist)}>
                  <Play className="mr-2 h-4 w-4" />
                  Riproduci
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onLikePlaylist(playlist.id)}>
                  <Heart className={cn('mr-2 h-4 w-4', playlist.isLiked && 'fill-current text-red-500')} />
                  {playlist.isLiked ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onSharePlaylist(playlist)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Condividi
                </DropdownMenuItem>
                
                {isOwner && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setEditingPlaylist(playlist)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifica
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeletePlaylist(playlist.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Elimina
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Playlist meta */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
            <div className="flex items-center space-x-3">
              <span>{playlist.songCount} brani</span>
              <span>{formatDuration(playlist.duration)}</span>
            </div>
            
            {playlist.followers && (
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{playlist.followers}</span>
              </div>
            )}
          </div>

          {/* Creator info */}
          <div className="flex items-center space-x-2 mt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={playlist.creator.avatar} />
              <AvatarFallback className="text-xs">
                {playlist.creator.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              di {playlist.creator.name}
            </span>
          </div>
        </CardHeader>
      </Card>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Le Tue Playlist</h1>
            <p className="text-muted-foreground">
              {processedPlaylists.length} playlist trovate
            </p>
          </div>

          {/* Create New Playlist Button */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full lg:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Nuova Playlist
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Crea Nuova Playlist</DialogTitle>
                <DialogDescription>
                  Crea una nuova playlist per organizzare i tuoi brani preferiti.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="playlist-name">Nome della playlist</Label>
                  <Input
                    id="playlist-name"
                    placeholder="La mia playlist"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="playlist-description">Descrizione (opzionale)</Label>
                  <Textarea
                    id="playlist-description"
                    placeholder="Descrivi la tua playlist..."
                    value={newPlaylistDescription}
                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="playlist-public"
                    checked={newPlaylistIsPublic}
                    onCheckedChange={setNewPlaylistIsPublic}
                  />
                  <Label htmlFor="playlist-public">Rendi pubblica</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isCreating}
                >
                  Annulla
                </Button>
                <Button 
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim() || isCreating}
                >
                  {isCreating ? 'Creazione...' : 'Crea Playlist'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Cerca playlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter */}
          <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filtra per" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte</SelectItem>
              <SelectItem value="mine">Le mie</SelectItem>
              <SelectItem value="liked">Preferite</SelectItem>
              <SelectItem value="public">Pubbliche</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full lg:w-auto">
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4 mr-2" /> : <SortDesc className="w-4 h-4 mr-2" />}
                Ordina
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ordina per</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <DropdownMenuRadioItem value="date">Data</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name">Nome</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="songs">N° brani</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="duration">Durata</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                <DropdownMenuRadioItem value="asc">Crescente</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc">Decrescente</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="p-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Vista griglia</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="p-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Vista elenco</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Playlists Grid/List */}
        {processedPlaylists.length > 0 ? (
          <div className={cn(
            viewMode === 'grid' 
              ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'space-y-2'
          )}>
            {processedPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nessuna playlist trovata</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Prova a modificare i termini di ricerca o i filtri'
                : 'Inizia creando la tua prima playlist!'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crea Prima Playlist
              </Button>
            )}
          </div>
        )}

        {/* Edit Playlist Dialog */}
        {editingPlaylist && (
          <Dialog open={!!editingPlaylist} onOpenChange={() => setEditingPlaylist(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Modifica Playlist</DialogTitle>
                <DialogDescription>
                  Modifica le informazioni della tua playlist.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-playlist-name">Nome della playlist</Label>
                  <Input
                    id="edit-playlist-name"
                    value={editingPlaylist.name}
                    onChange={(e) => setEditingPlaylist({
                      ...editingPlaylist,
                      name: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-playlist-description">Descrizione</Label>
                  <Textarea
                    id="edit-playlist-description"
                    value={editingPlaylist.description || ''}
                    onChange={(e) => setEditingPlaylist({
                      ...editingPlaylist,
                      description: e.target.value
                    })}
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-playlist-public"
                    checked={editingPlaylist.isPublic}
                    onCheckedChange={(checked) => setEditingPlaylist({
                      ...editingPlaylist,
                      isPublic: checked
                    })}
                  />
                  <Label htmlFor="edit-playlist-public">Pubblica</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setEditingPlaylist(null)}
                >
                  Annulla
                </Button>
                <Button 
                  onClick={() => handleUpdatePlaylist(editingPlaylist, editingPlaylist)}
                  disabled={!editingPlaylist.name.trim()}
                >
                  Salva Modifiche
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </TooltipProvider>
  );
};

export default PlaylistManager;
