
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface Pokemon {
  name: string;
  id: number;
  image: string;
  types: string[];
}

interface PokemonCardProps {
  pokemon: Pokemon;
  index: number;
}

const typeColors: { [key: string]: string } = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-green-400',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

const typeGradients: { [key: string]: string } = {
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

export const PokemonCard = ({ pokemon, index }: PokemonCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const primaryType = pokemon.types[0];
  const gradientClass = typeGradients[primaryType] || 'from-gray-400 to-gray-600';

  const handleClick = () => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  return (
    <Card 
      className={`relative overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group bg-gradient-to-br ${gradientClass} border-0 animate-fade-in`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={handleClick}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 20 0 L 0 0 0 20" fill="none" stroke="white" stroke-width="1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grid)" /%3E%3C/svg%3E')]"></div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

      <div className="relative p-6 text-white">
        {/* Pokemon Number */}
        <div className="absolute top-4 right-4 bg-black/20 rounded-full px-3 py-1">
          <span className="text-sm font-bold">#{pokemon.id.toString().padStart(3, '0')}</span>
        </div>

        {/* Pokemon Image */}
        <div className="flex justify-center mb-4 relative">
          <div className="w-32 h-32 flex items-center justify-center">
            {!imageLoaded && (
              <div className="w-32 h-32 bg-white/20 rounded-full animate-pulse"></div>
            )}
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className={`w-full h-full object-contain transition-all duration-500 transform group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </div>
        </div>

        {/* Pokemon Name */}
        <h3 className="text-2xl font-bold text-center mb-3 capitalize">
          {pokemon.name}
        </h3>

        {/* Types */}
        <div className="flex justify-center gap-2 flex-wrap">
          {pokemon.types.map((type) => (
            <Badge
              key={type}
              className={`${typeColors[type]} text-white border-0 px-3 py-1 text-sm font-semibold capitalize shadow-lg`}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};
