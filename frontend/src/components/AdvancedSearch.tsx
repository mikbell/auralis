import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Search as SearchIcon, 
  X, 
  Filter, 
  Music, 
  User, 
  Disc3, 
  History,
  ArrowUpRight
} from 'lucide-react';

import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';

import { cn } from '@/lib/utils';
import { useMusicStore } from '@/stores/useMusicStore';
import { usePlayerStore } from '@/stores/usePlayerStore';
import SongCardOptimized from './SongCardOptimized';
import { LoadingSpinner } from './LoadingSpinner';

const GENRES = [
  'all',
  'pop',
  'rock',
  'hip-hop',
  'jazz',
  'classical',
  'electronic',
  'country',
  'r&b',
  'indie',
  'other'
];

const SEARCH_TYPES = [
  { value: 'all', label: 'Tutto' },
  { value: 'songs', label: 'Brani' },
  { value: 'albums', label: 'Album' },
  { value: 'artists', label: 'Artisti' }
];

interface AdvancedSearchProps {
  onSearchResults?: (results: any) => void;
  placeholder?: string;
  className?: string;
  showQuickSearch?: boolean;
  compact?: boolean;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearchResults,
  placeholder = 'Cerca brani, artisti o album...',
  className,
  showQuickSearch = true,
  compact = false
}) => {
  // Local state
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('all');
  const [searchType, setSearchType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showQuickSearchDropdown, setShowQuickSearchDropdown] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const quickSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Store
  const { 
    searchResults, 
    isSearching, 
    quickSearchSuggestions,
    recentSearches,
    searchMusic, 
    quickSearch,
    clearSearchResults,
    clearRecentSearches
  } = useMusicStore();

  const { setCurrentSong } = usePlayerStore();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Debounce quick search
  useEffect(() => {
    if (quickSearchTimeoutRef.current) {
      clearTimeout(quickSearchTimeoutRef.current);
    }

    if (query.trim().length >= 2) {
      quickSearchTimeoutRef.current = setTimeout(() => {
        quickSearch(query);
      }, 200);
    }

    return () => {
      if (quickSearchTimeoutRef.current) {
        clearTimeout(quickSearchTimeoutRef.current);
      }
    };
  }, [query, quickSearch]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      const filters = {
        type: searchType,
        ...(genre !== 'all' && { genre })
      };
      searchMusic(debouncedQuery, filters);
    } else {
      clearSearchResults();
    }
  }, [debouncedQuery, searchType, genre, searchMusic, clearSearchResults]);

  // Notify parent component of results
  useEffect(() => {
    onSearchResults?.(searchResults);
  }, [searchResults, onSearchResults]);

  // Handle search input change
  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (showQuickSearch && value.trim().length >= 2) {
      setShowQuickSearchDropdown(true);
    } else {
      setShowQuickSearchDropdown(false);
    }
  }, [showQuickSearch]);

  // Handle search submission
  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    setShowQuickSearchDropdown(false);
    
    const filters = {
      type: searchType,
      ...(genre !== 'all' && { genre })
    };
    searchMusic(searchQuery, filters);
  }, [searchType, genre, searchMusic]);

  // Handle clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setGenre('all');
    setSearchType('all');
    clearSearchResults();
    setShowQuickSearchDropdown(false);
  }, [clearSearchResults]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: any) => {
    if (suggestion.type === 'song') {
      // Find the full song object from search results if available
      const fullSong = searchResults.songs.find(song => song._id === suggestion.id);
      if (fullSong) {
        setCurrentSong(fullSong);
      }
    }
    setQuery(suggestion.title);
    setShowQuickSearchDropdown(false);
  }, [searchResults.songs, setCurrentSong]);

  // Handle recent search click
  const handleRecentSearchClick = useCallback((recentSearch: string) => {
    handleSearch(recentSearch);
  }, [handleSearch]);


  // Memoized values
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (genre !== 'all') count++;
    if (searchType !== 'all') count++;
    return count;
  }, [genre, searchType]);

  const hasResults = useMemo(() => {
    return searchResults.total > 0;
  }, [searchResults.total]);

  // Render search suggestions dropdown
  const renderQuickSearchDropdown = () => {
    if (!showQuickSearchDropdown || (!quickSearchSuggestions.length && !recentSearches.length)) {
      return null;
    }

    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
        <Command>
          <CommandList>
            {quickSearchSuggestions.length > 0 && (
              <CommandGroup heading="Risultati">
                {quickSearchSuggestions.map((suggestion) => (
                  <CommandItem
                    key={`${suggestion.type}-${suggestion.id}`}
                    className="cursor-pointer"
                    onSelect={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.type === 'song' ? (
                      <Music className="mr-2 h-4 w-4" />
                    ) : (
                      <User className="mr-2 h-4 w-4" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">{suggestion.title}</span>
                      <span className="text-xs text-muted-foreground">{suggestion.artist}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {recentSearches.length > 0 && quickSearchSuggestions.length > 0 && (
              <CommandSeparator />
            )}
            
            {recentSearches.length > 0 && (
              <CommandGroup heading="Ricerche recenti">
                {recentSearches.slice(0, 5).map((recentSearch, index) => (
                  <CommandItem
                    key={`recent-${index}`}
                    className="cursor-pointer"
                    onSelect={() => handleRecentSearchClick(recentSearch)}
                  >
                    <History className="mr-2 h-4 w-4" />
                    <span>{recentSearch}</span>
                    <ArrowUpRight className="ml-auto h-3 w-3" />
                  </CommandItem>
                ))}
                {recentSearches.length > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandItem
                      className="cursor-pointer text-muted-foreground"
                      onSelect={() => clearRecentSearches()}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancella cronologia
                    </CommandItem>
                  </>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </div>
    );
  };

  // Render search results
  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner message="Ricerca in corso..." />
        </div>
      );
    }

    if (!query.trim()) {
      return (
        <div className="text-center py-12">
          <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Inizia a cercare</h3>
          <p className="text-muted-foreground">
            Trova i tuoi brani, artisti e album preferiti
          </p>
        </div>
      );
    }

    if (!hasResults) {
      return (
        <div className="text-center py-12">
          <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Nessun risultato trovato</h3>
          <p className="text-muted-foreground mb-4">
            Nessun risultato per "{query}"
          </p>
          <Button variant="outline" onClick={clearSearch}>
            Cancella ricerca
          </Button>
        </div>
      );
    }

    return (
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">
            Tutto ({searchResults.total})
          </TabsTrigger>
          <TabsTrigger value="songs">
            Brani ({searchResults.songs.length})
          </TabsTrigger>
          <TabsTrigger value="albums">
            Album ({searchResults.albums.length})
          </TabsTrigger>
          <TabsTrigger value="artists">
            Artisti ({searchResults.artists.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Songs Section */}
          {searchResults.songs.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Music className="w-5 h-5" />
                Brani
              </h3>
              <div className="space-y-2">
                {searchResults.songs.slice(0, 5).map((song, index) => (
                  <SongCardOptimized
                    key={song._id}
                    song={song}
                    variant="compact"
                    showIndex
                    index={index + 1}
                    onLike={() => {}} // TODO: Implement like functionality
                    onAddToQueue={() => {}} // TODO: Implement queue functionality
                    onAddToPlaylist={() => {}} // TODO: Implement playlist functionality
                  />
                ))}
              </div>
            </div>
          )}

          {/* Artists Section */}
          {searchResults.artists.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Artisti
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.artists.slice(0, 8).map((artist) => (
                  <Card key={artist._id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardHeader className="text-center p-4">
                      <div className="w-16 h-16 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-sm truncate">{artist.artist}</CardTitle>
                      <CardDescription className="text-xs">
                        {artist.songCount} brani • {artist.totalPlays} riproduzioni
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Albums Section */}
          {searchResults.albums.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Disc3 className="w-5 h-5" />
                Album
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.albums.slice(0, 8).map((album) => (
                  <Card key={album._id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                      <Disc3 className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm truncate">{album.title}</CardTitle>
                      <CardDescription className="text-xs">{album.artist}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="songs" className="space-y-2">
          {searchResults.songs.map((song, index) => (
            <SongCardOptimized
              key={song._id}
              song={song}
              showIndex
              index={index + 1}
              onLike={() => {}} // TODO: Implement like functionality
              onAddToQueue={() => {}} // TODO: Implement queue functionality
              onAddToPlaylist={() => {}} // TODO: Implement playlist functionality
            />
          ))}
        </TabsContent>

        <TabsContent value="albums" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.albums.map((album) => (
              <Card key={album._id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                  <Disc3 className="w-16 h-16 text-muted-foreground" />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="truncate">{album.title}</CardTitle>
                  <CardDescription>{album.artist}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="artists" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.artists.map((artist) => (
              <Card key={artist._id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardHeader className="text-center p-6">
                  <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <CardTitle className="truncate">{artist.artist}</CardTitle>
                  <CardDescription>
                    {artist.songCount} brani • {artist.totalPlays} riproduzioni
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  if (compact) {
    return (
      <div className={cn('relative', className)}>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            ref={searchInputRef}
            value={query}
            onChange={handleQueryChange}
            placeholder={placeholder}
            className="pl-10 pr-8"
            onFocus={() => showQuickSearch && setShowQuickSearchDropdown(true)}
            onBlur={() => {
              setTimeout(() => setShowQuickSearchDropdown(false), 200);
            }}
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1.5 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        {renderQuickSearchDropdown()}
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search Input with Filters */}
      <div className="space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            ref={searchInputRef}
            value={query}
            onChange={handleQueryChange}
            placeholder={placeholder}
            className="pl-10 pr-20"
            onFocus={() => showQuickSearch && setShowQuickSearchDropdown(true)}
            onBlur={() => {
              setTimeout(() => setShowQuickSearchDropdown(false), 200);
            }}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {/* Filters Button */}
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1.5 h-auto relative"
                >
                  <Filter className="w-4 h-4" />
                  {activeFiltersCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filtri di Ricerca</h4>
                  
                  {/* Search Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo di ricerca</label>
                    <Select value={searchType} onValueChange={setSearchType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SEARCH_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Genre Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Genere</label>
                    <Select value={genre} onValueChange={setGenre}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tutti i generi" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENRES.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g === 'all' ? 'Tutti i generi' : g.charAt(0).toUpperCase() + g.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <Button 
                      onClick={() => {
                        setGenre('all');
                        setSearchType('all');
                      }}
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                    >
                      Cancella Filtri
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Clear Search */}
            {(query || activeFiltersCount > 0) && (
              <Button
                onClick={clearSearch}
                variant="ghost"
                size="sm"
                className="p-1.5 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {renderQuickSearchDropdown()}
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {searchType !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Tipo: {SEARCH_TYPES.find(t => t.value === searchType)?.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto ml-1"
                  onClick={() => setSearchType('all')}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
            {genre !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Genere: {genre}
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto ml-1"
                  onClick={() => setGenre('all')}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="min-h-[400px]">
        {renderSearchResults()}
      </div>
    </div>
  );
};

export default AdvancedSearch;
