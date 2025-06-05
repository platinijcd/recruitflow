
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp,
  Plus,
  Eye,
  MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Poste, Candidature } from '@/types';

const Dashboard = () => {
  // Données de démonstration
  const [postes] = useState<Poste[]>([
    {
      id: '1',
      titre: 'Développeur Full Stack',
      description: 'Recherche développeur expérimenté en React/Node.js',
      nombre_de_postes: 2,
      date_limite: '2024-07-15',
      recruteurs_assignes: ['rec1', 'rec2'],
      date_creation: '2024-06-01',
      statut: 'Ouvert',
      type_contrat: 'CDI',
      lieu: 'Paris'
    },
    {
      id: '2',
      titre: 'Designer UX/UI',
      description: 'Designer créatif pour nos projets mobiles',
      nombre_de_postes: 1,
      date_limite: '2024-07-20',
      recruteurs_assignes: ['rec1'],
      date_creation: '2024-06-05',
      statut: 'Ouvert',
      type_contrat: 'CDI',
      lieu: 'Lyon'
    },
    {
      id: '3',
      titre: 'Chef de Projet Digital',
      description: 'Management d\'équipes techniques',
      nombre_de_postes: 1,
      date_limite: '2024-06-30',
      recruteurs_assignes: ['rec2'],
      date_creation: '2024-05-15',
      statut: 'Fermé',
      type_contrat: 'CDI',
      lieu: 'Remote'
    }
  ]);

  const [stats] = useState({
    totalCandidatures: 156,
    aEvaluer: 23,
    pertinentes: 45,
    entretiensAVenir: 12,
    postesOuverts: 8
  });

  const getCandidatureCount = (posteId: string) => {
    // Simulation des données - à remplacer par de vraies données
    const counts = { '1': 45, '2': 23, '3': 12 };
    return counts[posteId as keyof typeof counts] || 0;
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Ouvert': return 'bg-recruit-green text-white';
      case 'Fermé': return 'bg-recruit-red text-white';
      case 'En pause': return 'bg-recruit-orange text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de vos recrutements</p>
        </div>
        <Button className="bg-recruit-blue hover:bg-recruit-blue-dark">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau poste
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-recruit-blue" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCandidatures}</p>
                <p className="text-sm text-gray-600">Total candidatures</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-recruit-orange" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.aEvaluer}</p>
                <p className="text-sm text-gray-600">À évaluer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-recruit-green" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pertinentes}</p>
                <p className="text-sm text-gray-600">Pertinentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-recruit-blue" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.entretiensAVenir}</p>
                <p className="text-sm text-gray-600">Entretiens à venir</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-recruit-gray" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.postesOuverts}</p>
                <p className="text-sm text-gray-600">Postes ouverts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des postes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Postes ouverts</CardTitle>
            <Link to="/postes">
              <Button variant="outline" size="sm">
                Voir tous les postes
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {postes.filter(poste => poste.statut === 'Ouvert').map((poste) => (
              <div key={poste.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg text-gray-900">{poste.titre}</h3>
                      <Badge className={getStatusColor(poste.statut)}>
                        {poste.statut}
                      </Badge>
                      <Badge variant="outline">{poste.type_contrat}</Badge>
                    </div>
                    <p className="text-gray-600 mt-1">{poste.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <span>{poste.lieu}</span>
                      <span>•</span>
                      <span>{poste.nombre_de_postes} poste{poste.nombre_de_postes > 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span>Date limite: {new Date(poste.date_limite).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-recruit-blue">{getCandidatureCount(poste.id)}</p>
                      <p className="text-sm text-gray-600">candidatures</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link to={`/poste/${poste.id}/candidatures`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir candidatures
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
