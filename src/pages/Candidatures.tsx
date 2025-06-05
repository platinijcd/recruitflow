
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CandidatureCard from '@/components/CandidatureCard';
import { Search, Filter, Download, Plus } from 'lucide-react';
import type { Candidature } from '@/types';

const Candidatures = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [posteFilter, setPosteFilter] = useState<string>('all');

  // Données de démonstration
  const [candidatures] = useState<Candidature[]>([
    {
      id: '1',
      nom: 'Marie Dupont',
      email: 'marie.dupont@email.com',
      telephone: '06 12 34 56 78',
      lien_linkedin: 'https://linkedin.com/in/marie-dupont',
      poste_souhaite: 'Développeur Full Stack',
      statut: 'A évaluer',
      date_reception: '2024-06-10',
      note: 8,
      competences: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      experience_annees: 5
    },
    {
      id: '2',
      nom: 'Pierre Martin',
      email: 'pierre.martin@email.com',
      telephone: '06 98 76 54 32',
      lien_linkedin: 'https://linkedin.com/in/pierre-martin',
      poste_souhaite: 'Designer UX/UI',
      statut: 'Pertinent',
      date_reception: '2024-06-08',
      note: 9,
      commentaire_evaluateur: 'Excellent portfolio, expérience solide',
      competences: ['Figma', 'Sketch', 'Adobe CC', 'Prototyping'],
      experience_annees: 7
    },
    {
      id: '3',
      nom: 'Julie Leroy',
      email: 'julie.leroy@email.com',
      telephone: '06 45 67 89 12',
      poste_souhaite: 'Chef de Projet Digital',
      statut: 'Entretien programmé',
      date_reception: '2024-06-05',
      date_entretien: '2024-06-15',
      recruteur_assigne: 'John Doe',
      note: 7,
      competences: ['Agile', 'Scrum', 'JIRA', 'Leadership'],
      experience_annees: 6
    },
    {
      id: '4',
      nom: 'Thomas Blanc',
      email: 'thomas.blanc@email.com',
      telephone: '06 11 22 33 44',
      lien_linkedin: 'https://linkedin.com/in/thomas-blanc',
      poste_souhaite: 'Développeur Full Stack',
      statut: 'Rejeté',
      date_reception: '2024-06-03',
      note: 4,
      commentaire_evaluateur: 'Expérience insuffisante pour le poste',
      competences: ['JavaScript', 'HTML', 'CSS'],
      experience_annees: 2
    }
  ]);

  const filteredCandidatures = candidatures.filter(candidature => {
    const matchesSearch = candidature.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidature.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidature.poste_souhaite.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || candidature.statut === statusFilter;
    const matchesPoste = posteFilter === 'all' || candidature.poste_souhaite === posteFilter;
    
    return matchesSearch && matchesStatus && matchesPoste;
  });

  const postes = [...new Set(candidatures.map(c => c.poste_souhaite))];

  const handleSendEmail = (candidature: Candidature) => {
    console.log('Envoi email pour:', candidature.nom);
    // Ici, appel webhook n8n pour envoyer l'email
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidatures</h1>
          <p className="text-gray-600 mt-1">Gérez toutes vos candidatures reçues</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button className="bg-recruit-blue hover:bg-recruit-blue-dark">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter candidature
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtres</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, email, poste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="A évaluer">À évaluer</SelectItem>
                <SelectItem value="Pertinent">Pertinent</SelectItem>
                <SelectItem value="Rejeté">Rejeté</SelectItem>
                <SelectItem value="Entretien programmé">Entretien programmé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={posteFilter} onValueChange={setPosteFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Poste" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Tous les postes</SelectItem>
                {postes.map(poste => (
                  <SelectItem key={poste} value={poste}>{poste}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setPosteFilter('all');
            }}>
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCandidatures.map((candidature) => (
          <CandidatureCard 
            key={candidature.id} 
            candidature={candidature}
            onSendEmail={handleSendEmail}
          />
        ))}
      </div>

      {/* Message si aucun résultat */}
      {filteredCandidatures.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Aucune candidature ne correspond à vos critères de recherche.</p>
          </CardContent>
        </Card>
      )}

      {/* Statistiques en bas */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredCandidatures.length} candidature{filteredCandidatures.length > 1 ? 's' : ''} affichée{filteredCandidatures.length > 1 ? 's' : ''}</span>
            <span>Total: {candidatures.length} candidatures</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Candidatures;
