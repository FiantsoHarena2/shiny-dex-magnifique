
import { Loader } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-32 h-32 border-8 border-white/20 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Inner Elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader className="w-12 h-12 text-white animate-spin" />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Chargement...</h2>
        <p className="text-white/80">Capture des Pokémons en cours</p>
      </div>
    </div>
  );
};
