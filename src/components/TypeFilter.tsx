
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const fetchTypes = async () => {
  const response = await fetch('https://pokeapi.co/api/v2/type');
  if (!response.ok) throw new Error('Failed to fetch types');
  const data = await response.json();
  return data.results;
};

export const TypeFilter = ({ value, onChange }: TypeFilterProps) => {
  const { data: types = [] } = useQuery({
    queryKey: ['pokemon-types'],
    queryFn: fetchTypes,
  });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-white/90 border-white/20 focus:bg-white focus:border-white/40 transition-all duration-300 rounded-xl shadow-lg">
        <SelectValue placeholder="Filtrer par type" />
      </SelectTrigger>
      <SelectContent className="bg-white border-white/20 shadow-xl rounded-xl">
        <SelectItem value="">Tous les types</SelectItem>
        {types.map((type: any) => (
          <SelectItem key={type.name} value={type.name} className="capitalize">
            {type.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
