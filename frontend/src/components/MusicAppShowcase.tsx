import React, { useState } from 'react';
import { Play, Heart, Music, Sparkles, TrendingUp } from 'lucide-react';

// Import optimized components
import SongCardOptimized from './SongCardOptimized';
import PlaylistManager from './PlaylistManager';

// Import shadcn/ui components with custom variants
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './ui/command';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from './ui/alert';

import type { Song } from '@/types';

// Mock data
const mockSongs: Song[] = [
  {
    _id: '1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    albumId: 'album1',
    imageUrl: '/album-covers/queen.jpg',
    audioUrl: '/audio/bohemian-rhapsody.mp3',
    duration: 355,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    album: { title: 'A Night at the Opera', _id: 'album1' },
    quality: 'HD'
  },
  {
    _id: '2',
    title: 'Hotel California',
    artist: 'Eagles',
    albumId: 'album2',
    imageUrl: '/album-covers/eagles.jpg',
    audioUrl: '/audio/hotel-california.mp3',
    duration: 391,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    album: { title: 'Hotel California', _id: 'album2' }
  },
  {
    _id: '3',
    title: 'Imagine',
    artist: 'John Lennon',
    albumId: 'album3',
    imageUrl: '/album-covers/imagine.jpg',
    audioUrl: '/audio/imagine.mp3',
    duration: 183,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    album: { title: 'Imagine', _id: 'album3' }
  },
];

const mockPlaylists = [
  {
    id: '1',
    name: 'Rock Classics',
    description: 'I migliori brani rock di tutti i tempi',
    cover: '/playlist-covers/rock-classics.jpg',
    songCount: 25,
    duration: 6300,
    isPublic: true,
    isLiked: true,
    creator: {
      id: 'user1',
      name: 'Mario Rossi',
      avatar: '/avatars/mario.jpg'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    tags: ['rock', 'classic'],
    followers: 1250
  },
  {
    id: '2',
    name: 'Chill Vibes',
    description: 'Musica rilassante per studiare e lavorare',
    songCount: 42,
    duration: 9840,
    isPublic: false,
    isLiked: false,
    creator: {
      id: 'user1',
      name: 'Mario Rossi'
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10'),
    tags: ['chill', 'ambient']
  }
];

const mockCurrentUser = {
  id: 'user1',
  name: 'Mario Rossi',
  avatar: '/avatars/mario.jpg'
};

const MusicAppShowcase: React.FC = () => {
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set(['1']));
  const [, setIsPlaying] = useState(false);

  // Handlers
  const handleLikeSong = (songId: string) => {
    setLikedSongs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(songId)) {
        newSet.delete(songId);
      } else {
        newSet.add(songId);
      }
      return newSet;
    });
  };

  const handlePlaySong = (song: Song) => {
    console.log('Playing song:', song.title);
    setIsPlaying(true);
  };


  const handleAddToQueue = (song: Song) => {
    console.log('Adding to queue:', song.title);
    // Implementa la logica per aggiungere alla coda
  };

  const handleAddToPlaylist = (song: Song) => {
    console.log('Adding to playlist:', song.title);
    // Implementa la logica per aggiungere alla playlist
  };

  const handleDownload = (song: Song) => {
    console.log('Downloading:', song.title);
    // Implementa la logica per il download
  };

  const handleShare = (song: Song) => {
    console.log('Sharing:', song.title);
    // Implementa la logica per la condivisione
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header with showcase of custom button variants */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              shadcn/ui Music App Showcase
            </h1>
            <p className="text-xl text-purple-200">
              Componenti ottimizzati per applicazioni musicali
            </p>
          </div>
          
          {/* Custom button variants showcase */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="play" size="lg">
              <Play className="w-5 h-5" />
              Play Button
            </Button>
            <Button variant="music">
              <Music className="w-4 h-4" />
              Music Gradient
            </Button>
            <Button variant="spotify">
              <Sparkles className="w-4 h-4" />
              Spotify Style
            </Button>
            <Button variant="equalizer">
              <TrendingUp className="w-4 h-4" />
              Equalizer
            </Button>
            <Button variant="glassmorphism">
              <Heart className="w-4 h-4" />
              Glassmorphism
            </Button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-400" />
                SongCard Ottimizzata
              </CardTitle>
              <CardDescription className="text-purple-200">
                Supporta varianti, context menu, hover effects e stati di download
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                PlaylistManager
              </CardTitle>
              <CardDescription className="text-purple-200">
                Gestione completa delle playlist con filtri, ricerca e modalità vista
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Varianti Personalizzate
              </CardTitle>
              <CardDescription className="text-purple-200">
                Button con temi musicali e effetti glassmorphism
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="songs" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md">
            <TabsTrigger value="songs" className="text-white data-[state=active]:bg-white/20">
              Brani Ottimizzati
            </TabsTrigger>
            <TabsTrigger value="playlists" className="text-white data-[state=active]:bg-white/20">
              Playlist Manager
            </TabsTrigger>
            <TabsTrigger value="search" className="text-white data-[state=active]:bg-white/20">
              Search Avanzata
            </TabsTrigger>
          </TabsList>

          {/* Songs Tab - Showcase SongCardOptimized */}
          <TabsContent value="songs" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">SongCard Ottimizzate</CardTitle>
                <CardDescription className="text-purple-200">
                  Esempi di SongCard con diverse varianti e funzionalità
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Variant Examples */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Varianti Disponibili:</h3>
                  
                  {/* Default variant */}
                  <div className="space-y-2">
                    <Badge variant="secondary">Default</Badge>
                    <SongCardOptimized
                      song={mockSongs[0]}
                      isLiked={likedSongs.has(mockSongs[0]._id)}
                      onLike={handleLikeSong}
                      onAddToQueue={handleAddToQueue}
                      onAddToPlaylist={handleAddToPlaylist}
                      onDownload={handleDownload}
                      onShare={handleShare}
                      showIndex
                      index={1}
                    />
                  </div>

                  <Separator className="bg-white/20" />

                  {/* Compact variant */}
                  <div className="space-y-2">
                    <Badge variant="secondary">Compact</Badge>
                    <SongCardOptimized
                      song={mockSongs[1]}
                      variant="compact"
                      isLiked={likedSongs.has(mockSongs[1]._id)}
                      onLike={handleLikeSong}
                      onAddToQueue={handleAddToQueue}
                      onAddToPlaylist={handleAddToPlaylist}
                    />
                  </div>

                  <Separator className="bg-white/20" />

                  {/* Detailed variant with download progress */}
                  <div className="space-y-2">
                    <Badge variant="secondary">Detailed with Download</Badge>
                    <SongCardOptimized
                      song={mockSongs[2]}
                      variant="detailed"
                      isLiked={likedSongs.has(mockSongs[2]._id)}
                      isDownloading={true}
                      downloadProgress={65}
                      onLike={handleLikeSong}
                      onAddToQueue={handleAddToQueue}
                      onAddToPlaylist={handleAddToPlaylist}
                      onDownload={handleDownload}
                      onShare={handleShare}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Playlists Tab - Showcase PlaylistManager */}
          <TabsContent value="playlists" className="space-y-6">
            <PlaylistManager
              playlists={mockPlaylists}
              currentUser={mockCurrentUser}
              onCreatePlaylist={async (playlist) => {
                console.log('Creating playlist:', playlist);
              }}
              onUpdatePlaylist={async (id, updates) => {
                console.log('Updating playlist:', id, updates);
              }}
              onDeletePlaylist={async (id) => {
                console.log('Deleting playlist:', id);
              }}
              onPlayPlaylist={(playlist) => {
                console.log('Playing playlist:', playlist.name);
              }}
              onLikePlaylist={(id) => {
                console.log('Liking playlist:', id);
              }}
              onSharePlaylist={(playlist) => {
                console.log('Sharing playlist:', playlist.name);
              }}
            />
          </TabsContent>

          {/* Advanced Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Search Musicale Avanzata</CardTitle>
                <CardDescription className="text-purple-200">
                  Componente Command di shadcn/ui ottimizzato per ricerche musicali
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Command className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <CommandInput 
                    placeholder="Cerca brani, artisti, album..." 
                    className="text-white placeholder:text-white/60"
                  />
                  <CommandList>
                    <CommandEmpty className="text-white/60">Nessun risultato trovato.</CommandEmpty>
                    
                    <CommandGroup heading="Brani" className="text-white/80">
                      {mockSongs.map((song, index) => (
                        <CommandItem 
                          key={song._id}
                          className="text-white hover:bg-white/20"
                          onSelect={() => handlePlaySong(song)}
                        >
                          <Music className="mr-2 h-4 w-4" />
                          <span>{song.title} - {song.artist}</span>
                          <CommandShortcut className="text-white/60">
                            ⌘{index + 1}
                          </CommandShortcut>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    
                    <CommandSeparator className="bg-white/20" />
                    
                    <CommandGroup heading="Playlist" className="text-white/80">
                      {mockPlaylists.map((playlist, index) => (
                        <CommandItem 
                          key={playlist.id}
                          className="text-white hover:bg-white/20"
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          <span>{playlist.name}</span>
                          <CommandShortcut className="text-white/60">
                            ⌘P{index + 1}
                          </CommandShortcut>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Alert */}
        <Alert className="bg-blue-500/10 border-blue-400/20 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <AlertTitle className="text-blue-200">
            Componenti Completamente Ottimizzati!
          </AlertTitle>
          <AlertDescription className="text-blue-100">
            Questi componenti utilizzano le best practices di shadcn/ui con pattern avanzati come 
            compound components, context menu, hover cards, e varianti personalizzate per applicazioni musicali.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default MusicAppShowcase;
