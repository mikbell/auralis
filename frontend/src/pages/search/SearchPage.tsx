import React from 'react';
import AdvancedSearch from '@/components/AdvancedSearch';

const SearchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Cerca Musica
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trova i tuoi brani, artisti e album preferiti nella nostra vasta libreria musicale
          </p>
        </div>

        {/* Advanced Search Component */}
        <AdvancedSearch 
          className="max-w-4xl mx-auto"
          showQuickSearch={true}
        />
      </div>
    </div>
  );
};

export default SearchPage;
