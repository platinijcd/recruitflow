
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Plus, Calendar, Clock, MapPin, User } from 'lucide-react';
import { useInterviews } from '@/hooks/useInterviews';

const Entretiens = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: interviews = [], isLoading } = useInterviews();

  const getStatusColor = (scheduledAt: string) => {
    const interviewDate = new Date(scheduledAt);
    const now = new Date();
    const isPast = interviewDate < now;
    
    if (isPast) {
      return 'bg-gray-500 text-white';
    } else {
      return 'bg-recruit-blue text-white';
    }
  };

  const getStatusLabel = (scheduledAt: string) => {
    const interviewDate = new Date(scheduledAt);
    const now = new Date();
    const isPast = interviewDate < now;
    
    return isPast ? 'Terminé' : 'Programmé';
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidates?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.recruiters?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.posts?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = getStatusLabel(interview.scheduled_at);
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Entretiens</h1>
          <p className="text-gray-600 mt-1">Gérez tous vos entretiens programmés</p>
        </div>
        <Button className="bg-recruit-blue hover:bg-recruit-blue-dark">
          <Plus className="h-4 w-4 mr-2" />
          Programmer un entretien
        </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par candidat, recruteur ou poste..."
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
                <SelectItem value="Programmé">Programmé</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}>
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table des entretiens */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des entretiens</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Recruteur</TableHead>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInterviews.map((interview) => (
                <TableRow key={interview.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {interview.candidates?.name || 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {interview.posts?.title || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {interview.recruiters?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium">
                          {new Date(interview.scheduled_at).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(interview.scheduled_at).toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{interview.location || 'Non spécifié'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(interview.scheduled_at)}>
                      {getStatusLabel(interview.scheduled_at)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Modifier
                      </Button>
                      {interview.feedback ? (
                        <Button size="sm" variant="outline">
                          Voir feedback
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          Ajouter feedback
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredInterviews.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun entretien ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques en bas */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredInterviews.length} entretien{filteredInterviews.length > 1 ? 's' : ''} affiché{filteredInterviews.length > 1 ? 's' : ''}</span>
            <span>Total: {interviews.length} entretiens</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Entretiens;
