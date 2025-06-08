
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Linkedin, UserPlus, ExternalLink, Info } from 'lucide-react';
import { toast } from 'sonner';

interface LinkedInProfile {
  fullName: string;
  headline: string;
  summary?: string;
  profilePicture?: string;
  location: string;
  profileURL: string;
  username: string;
}

interface SearchResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    items: LinkedInProfile[];
  };
}

const Recherche = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    keywords: '',
    location: ''
  });
  
  const [searchResults, setSearchResults] = useState<LinkedInProfile[]>([]);

  const handleSearch = async () => {
    if (!searchCriteria.keywords && !searchCriteria.location) {
      toast.error('Veuillez renseigner au moins un critère de recherche');
      return;
    }

    setIsSearching(true);
    
    try {
      const params = new URLSearchParams();
      if (searchCriteria.keywords) params.append('keyword', searchCriteria.keywords);
      if (searchCriteria.location) params.append('location', searchCriteria.location);

      const response = await fetch(
        `https://polite-wrongly-phoenix.ngrok-free.app/webhook/114f1a40-b072-4038-9775-837b26ed1042?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: SearchResponse[] = await response.json();
      
      if (data[0]?.success && data[0]?.data?.items) {
        setSearchResults(data[0].data.items);
        toast.success(`${data[0].data.items.length} profils trouvés`);
      } else {
        setSearchResults([]);
        toast.error(data[0]?.message || 'Aucun résultat trouvé');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast.error('Erreur lors de la recherche. Veuillez réessayer.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToDatabase = (profile: LinkedInProfile) => {
    console.log('Ajout du profil à la base:', profile.fullName);
    toast.success(`Profil de ${profile.fullName} ajouté à la base de données`);
  };

  const getInitials = (nom: string) => {
    return nom.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton d'information */}
      <div className="flex items-center space-x-2">
        <h1 className="text-3xl font-bold text-gray-900">Recherche LinkedIn</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" className="bg-recruit-blue hover:bg-recruit-blue-dark rounded-full w-6 h-6 p-0">
              <Info className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" side="right">
            <div className="space-y-2 text-sm">
              <h4 className="font-semibold text-recruit-blue-dark">Comment utiliser la recherche LinkedIn ?</h4>
              <p>1. <strong>Remplissez les critères</strong> de recherche selon vos besoins</p>
              <p>2. <strong>Lancez la recherche</strong> - un webhook sera envoyé à n8n</p>
              <p>3. <strong>n8n scrape LinkedIn</strong> et retourne les profils correspondants</p>
              <p>4. <strong>Consultez les profils</strong> et ajoutez les candidats intéressants à votre base</p>
              <p className="text-recruit-blue-dark font-medium mt-3">
                ⚠️ Assurez-vous que votre workflow n8n est configuré et actif
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Formulaire de recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Critères de recherche</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Mots-clés (ex: React, Node.js)"
              value={searchCriteria.keywords}
              onChange={(e) => setSearchCriteria({...searchCriteria, keywords: e.target.value})}
            />
            
            <Input
              placeholder="Localisation (ex: Paris, France)"
              value={searchCriteria.location}
              onChange={(e) => setSearchCriteria({...searchCriteria, location: e.target.value})}
            />
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-recruit-blue hover:bg-recruit-blue-dark"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Recherche en cours...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Lancer la recherche
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setSearchCriteria({keywords: '', location: ''})}
            >
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultats de recherche */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Résultats de recherche ({searchResults.length})</span>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((profile, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={profile.profilePicture} />
                        <AvatarFallback className="bg-recruit-blue text-white">
                          {getInitials(profile.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{profile.fullName}</h3>
                        <p className="text-recruit-blue font-medium">{profile.headline}</p>
                        <p className="text-gray-600">{profile.location}</p>
                        
                        {profile.summary && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {profile.summary}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(profile.profileURL, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        LinkedIn
                      </Button>
                      
                      <Button 
                        size="sm"
                        onClick={() => handleAddToDatabase(profile)}
                        className="bg-recruit-green hover:bg-recruit-green/90"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Recherche;
