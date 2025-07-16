
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Ruler, Weight, Zap, Shield, Sword, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const fetchPokemonDetail = async (id: string) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!response.ok) throw new Error('Pokemon not found');
  return response.json();
};

const fetchPokemonSpecies = async (id: string) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  if (!response.ok) throw new Error('Pokemon species not found');
  return response.json();
};

const typeColors: { [key: string]: string } = {
  normal: 'from-gray-400 to-gray-600',
  fire: 'from-red-400 to-orange-600',
  water: 'from-blue-400 to-blue-600',
  electric: 'from-yellow-300 to-yellow-500',
  grass: 'from-green-400 to-green-600',
  ice: 'from-blue-200 to-blue-400',
  fighting: 'from-red-600 to-red-800',
  poison: 'from-purple-400 to-purple-600',
  ground: 'from-yellow-500 to-yellow-700',
  flying: 'from-indigo-300 to-indigo-500',
  psychic: 'from-pink-400 to-pink-600',
  bug: 'from-green-300 to-green-500',
  rock: 'from-yellow-700 to-yellow-900',
  ghost: 'from-purple-600 to-purple-800',
  dragon: 'from-indigo-600 to-indigo-800',
  dark: 'from-gray-700 to-gray-900',
  steel: 'from-gray-400 to-gray-600',
  fairy: 'from-pink-200 to-pink-400',
};

const statIcons: { [key: string]: any } = {
  hp: Heart,
  attack: Sword,
  defense: Shield,
  'special-attack': Zap,
  'special-defense': Shield,
  speed: Zap,
};

const PokemonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: pokemon, isLoading: pokemonLoading } = useQuery({
    queryKey: ['pokemon-detail', id],
    queryFn: () => fetchPokemonDetail(id!),
    enabled: !!id,
  });

  const { data: species } = useQuery({
    queryKey: ['pokemon-species', id],
    queryFn: () => fetchPokemonSpecies(id!),
    enabled: !!id,
  });

  if (pokemonLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Pokémon non trouvé</h1>
          <Button onClick={() => navigate('/')} variant="outline" className="bg-white/90">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const primaryType = pokemon.types[0].type.name;
  const gradientClass = typeColors[primaryType] || 'from-gray-400 to-gray-600';
  const description = species?.flavor_text_entries?.find(
    (entry: any) => entry.language.name === 'fr'
  )?.flavor_text || species?.flavor_text_entries?.find(
    (entry: any) => entry.language.name === 'en'
  )?.flavor_text || 'Aucune description disponible.';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass}`}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-8">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-6 bg-white/20 border-white/40 text-white hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Pokemon Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-150"></div>
                <img
                  src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="relative w-80 h-80 object-contain animate-fade-in"
                />
              </div>
            </div>

            {/* Pokemon Info */}
            <div className="text-white">
              <div className="mb-4">
                <span className="text-xl opacity-80">#{pokemon.id.toString().padStart(3, '0')}</span>
              </div>
              <h1 className="text-5xl font-bold capitalize mb-6">{pokemon.name}</h1>
              
              <div className="flex gap-3 mb-6">
                {pokemon.types.map((type: any) => (
                  <Badge
                    key={type.type.name}
                    className="bg-white/20 text-white border-white/40 px-4 py-2 text-lg font-semibold capitalize"
                  >
                    {type.type.name}
                  </Badge>
                ))}
              </div>

              <p className="text-lg opacity-90 leading-relaxed mb-6">
                {description.replace(/\f/g, ' ')}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white/20 border-white/40 p-4">
                  <div className="flex items-center text-white">
                    <Ruler className="w-6 h-6 mr-3" />
                    <div>
                      <div className="text-sm opacity-80">Taille</div>
                      <div className="text-xl font-bold">{pokemon.height / 10} m</div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white/20 border-white/40 p-4">
                  <div className="flex items-center text-white">
                    <Weight className="w-6 h-6 mr-3" />
                    <div>
                      <div className="text-sm opacity-80">Poids</div>
                      <div className="text-xl font-bold">{pokemon.weight / 10} kg</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Statistiques</h2>
          <div className="grid gap-6">
            {pokemon.stats.map((stat: any) => {
              const Icon = statIcons[stat.stat.name] || Zap;
              const percentage = Math.min((stat.base_stat / 255) * 100, 100);
              
              return (
                <div key={stat.stat.name} className="space-y-2">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="capitalize font-semibold">
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                    </div>
                    <span className="font-bold text-lg">{stat.base_stat}</span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-3 bg-white/20"
                  />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PokemonDetail;
