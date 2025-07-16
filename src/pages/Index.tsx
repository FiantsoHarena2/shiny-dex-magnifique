
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PokemonCard } from '@/components/PokemonCard';
import { SearchBar } from '@/components/SearchBar';
import { TypeFilter } from '@/components/TypeFilter';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Pokemon {
  name: string;
  url: string;
  id: number;
  image: string;
  types: string[];
}

const fetchPokemonList = async (offset: number = 0): Promise<{ results: any[], count: number }> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
  if (!response.ok) throw new Error('Failed to fetch Pokemon list');
  return response.json();
};

const fetchPokemonDetails = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch Pokemon details');
  return response.json();
};

const Index = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  const { data: pokemonData, isLoading } = useQuery({
    queryKey: ['pokemon', currentPage],
    queryFn: () => fetchPokemonList(currentPage * 20),
  });

  useEffect(() => {
    if (pokemonData?.results) {
      const fetchAllDetails = async () => {
        const detailsPromises = pokemonData.results.map(async (pokemon: any) => {
          const details = await fetchPokemonDetails(pokemon.url);
          return {
            name: pokemon.name,
            url: pokemon.url,
            id: details.id,
            image: details.sprites.other['official-artwork'].front_default || details.sprites.front_default,
            types: details.types.map((type: any) => type.type.name),
          };
        });
        
        const pokemonWithDetails = await Promise.all(detailsPromises);
        setPokemonList(pokemonWithDetails);
      };

      fetchAllDetails();
    }
  }, [pokemonData]);

  const filteredPokemon = pokemonList.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || pokemon.types.includes(selectedType);
    return matchesSearch && matchesType;
  });

  if (isLoading && pokemonList.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">
              Pokédex
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explorez l'univers fascinant des Pokémons et découvrez leurs caractéristiques uniques
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
            <div className="md:w-64">
              <TypeFilter value={selectedType} onChange={setSelectedType} />
            </div>
          </div>
        </div>

        {/* Pokemon Grid */}
        {filteredPokemon.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredPokemon.map((pokemon, index) => (
              <PokemonCard 
                key={pokemon.id} 
                pokemon={pokemon} 
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Aucun Pokémon trouvé pour cette recherche
            </p>
          </div>
        )}

        {/* Pagination */}
        {!searchTerm && !selectedType && (
          <div className="flex justify-center items-center gap-4">
            <Button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              variant="outline"
              size="lg"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>
            
            <div className="bg-card px-4 py-2 rounded-lg border">
              <span className="font-semibold text-foreground">
                Page {currentPage + 1}
              </span>
            </div>
            
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={isLoading}
              variant="outline"
              size="lg"
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
