import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Linkedin, UserPlus, ExternalLink, Info } from 'lucide-react';
import type { LinkedInProfile } from '@/types';
const Recherche = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    keywords: '',
    location: '',
    experience: '',
    company: '',
    title: ''
  });
  const [searchResults, setSearchResults] = useState<LinkedInProfile[]>([{
    nom: 'Alice Developer',
    titre_poste: 'Senior Full Stack Developer',
    entreprise: 'TechCorp',
    lieu: 'Paris, France',
    lien_linkedin: 'https://linkedin.com/in/alice-developer',
    experience_annees: 6,
    competences: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker']
  }, {
    nom: 'Bob Designer',
    titre_poste: 'Lead UX Designer',
    entreprise: 'DesignStudio',
    lieu: 'Lyon, France',
    lien_linkedin: 'https://linkedin.com/in/bob-designer',
    experience_annees: 8,
    competences: ['Figma', 'Design System', 'User Research', 'Prototyping']
  }, {
    nom: 'Claire Project',
    titre_poste: 'Senior Project Manager',
    entreprise: 'AgileCompany',
    lieu: 'Marseille, France',
    lien_linkedin: 'https://linkedin.com/in/claire-project',
    experience_annees: 7,
    competences: ['Scrum Master', 'Agile', 'Team Leadership', 'Stakeholder Management']
  }]);
  const handleSearch = async () => {
    setIsSearching(true);
    console.log('Recherche avec critères:', searchCriteria);
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };
  const handleAddToDatabase = (profile: LinkedInProfile) => {
    console.log('Ajout du profil à la base:', profile.nom);
  };
  const getInitials = (nom: string) => {
    return nom.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  return <div className="space-y-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input placeholder="Mots-clés (ex: React, Node.js)" value={searchCriteria.keywords} onChange={e => setSearchCriteria({
            ...searchCriteria,
            keywords: e.target.value
          })} />
            
            <Input placeholder="Localisation (ex: Paris, France)" value={searchCriteria.location} onChange={e => setSearchCriteria({
            ...searchCriteria,
            location: e.target.value
          })} />
            
            <Select value={searchCriteria.experience} onValueChange={value => setSearchCriteria({
            ...searchCriteria,
            experience: value
          })}>
              <SelectTrigger>
                <SelectValue placeholder="Années d'expérience" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="0-2">0-2 ans</SelectItem>
                <SelectItem value="3-5">3-5 ans</SelectItem>
                <SelectItem value="5-10">5-10 ans</SelectItem>
                <SelectItem value="10+">10+ ans</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            
            <Input placeholder="Titre du poste" value={searchCriteria.title} onChange={e => setSearchCriteria({
            ...searchCriteria,
            title: e.target.value
          })} />
          </div>
          
          <div className="flex space-x-3">
            <Button onClick={handleSearch} disabled={isSearching} className="bg-recruit-blue hover:bg-recruit-blue-dark">
              {isSearching ? <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Recherche en cours...
                </> : <>
                  <Search className="h-4 w-4 mr-2" />
                  Lancer la recherche
                </>}
            </Button>
            
            <Button variant="outline" onClick={() => setSearchCriteria({
            keywords: '',
            location: '',
            experience: '',
            company: '',
            title: ''
          })}>
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultats de recherche */}
      {searchResults.length > 0 && <Card>
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
              {searchResults.map((profile, index) => <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={profile.photo_url} />
                        <AvatarFallback className="bg-recruit-blue text-white">
                          {getInitials(profile.nom)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{profile.nom}</h3>
                        <p className="text-recruit-blue font-medium">{profile.titre_poste}</p>
                        <p className="text-gray-600">{profile.entreprise} • {profile.lieu}</p>
                        
                        {profile.experience_annees && <p className="text-sm text-gray-500 mt-1">
                            {profile.experience_annees} ans d'expérience
                          </p>}
                        
                        {profile.competences && profile.competences.length > 0 && <div className="flex flex-wrap gap-1 mt-2">
                            {profile.competences.slice(0, 5).map((competence, idx) => <Badge key={idx} variant="secondary" className="text-xs">
                                {competence}
                              </Badge>)}
                            {profile.competences.length > 5 && <Badge variant="secondary" className="text-xs">
                                +{profile.competences.length - 5}
                              </Badge>}
                          </div>}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => window.open(profile.lien_linkedin, '_blank')}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        LinkedIn
                      </Button>
                      
                      <Button size="sm" onClick={() => handleAddToDatabase(profile)} className="bg-recruit-green hover:bg-recruit-green/90">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>}
    </div>;
};
export default Recherche;