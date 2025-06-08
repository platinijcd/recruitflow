
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Search, Filter, Plus, Calendar as CalendarIcon, Clock, MapPin, User, List, CalendarDays, Eye } from 'lucide-react';
import { useInterviews } from '@/hooks/useInterviews';
import InterviewDetailPage from '@/components/InterviewDetailPage';

const Entretiens = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const { data: interviews = [], isLoading } = useInterviews();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-recruit-blue text-white';
      case 'Retained': return 'bg-recruit-green text-white';
      case 'Rejected': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'Programmé';
      case 'Retained': return 'Retenu';
      case 'Rejected': return 'Rejeté';
      default: return status;
    }
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidates?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.recruiters?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.posts?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || interview.interview_id === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getDayInterviews = (date: Date) => {
    return interviews.filter(interview => {
      const interviewDate = new Date(interview.scheduled_at);
      return interviewDate.toDateString() === date.toDateString();
    });
  };

  const handleViewDetails = (interview: any) => {
    setSelectedInterview(interview);
    setIsDetailOpen(true);
  };

  if (isLoading) {
    return <div className="p-6">Chargement des entretiens...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Section Filtres */}
      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtres:</span>
            </div>
            
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 rounded-lg">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-lg">
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Scheduled">Programmé</SelectItem>
                <SelectItem value="Retained">Retenu</SelectItem>
                <SelectItem value="Rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }} className="rounded-lg">
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section Vues et Bouton d'ajout */}
      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-lg"
              >
                <List className="h-4 w-4 mr-2" />
                Liste
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="rounded-lg"
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Calendrier
              </Button>
            </div>

            <Button className="bg-recruit-blue hover:bg-recruit-blue-dark">
              <Plus className="h-4 w-4 mr-2" />
              Programmer un entretien
            </Button>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'list' ? (
        /* Vue Liste */
        <Card>
          <CardHeader>
            <CardTitle>Liste des entretiens ({filteredInterviews.length})</CardTitle>
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
                          {interview.candidates?.name || 'Candidat non trouvé'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {interview.posts?.title || 'Poste non spécifié'}
                    </TableCell>
                    <TableCell>
                      {interview.recruiters?.name || 'Recruteur non assigné'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
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
                      <Badge className={getStatusColor(interview.interview_id || 'Unknown')}>
                        {getStatusLabel(interview.interview_id || 'Unknown')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDetails(interview)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        {interview.interview_id === 'Retained' && (
                          <Button size="sm" variant="outline">
                            {interview.feedback ? 'Voir feedback' : 'Ajouter feedback'}
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Supprimer
                        </Button>
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
      ) : (
        /* Vue Calendrier */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Calendrier</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                Entretiens pour {selectedDate?.toLocaleDateString('fr-FR') || 'Sélectionnez une date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-4">
                  {getDayInterviews(selectedDate).map((interview) => (
                    <div key={interview.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {interview.candidates?.name || 'Candidat non trouvé'}
                          </h3>
                          <p className="text-gray-600">{interview.posts?.title || 'Poste non spécifié'}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {new Date(interview.scheduled_at).toLocaleTimeString('fr-FR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{interview.location || 'Non spécifié'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{interview.recruiters?.name || 'Recruteur non assigné'}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(interview.interview_id || 'Unknown')}>
                          {getStatusLabel(interview.interview_id || 'Unknown')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {getDayInterviews(selectedDate).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Aucun entretien programmé pour cette date.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Sélectionnez une date pour voir les entretiens.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Statistiques en bas */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredInterviews.length} entretien{filteredInterviews.length > 1 ? 's' : ''} affiché{filteredInterviews.length > 1 ? 's' : ''}</span>
            <span>Total: {interviews.length} entretiens</span>
          </div>
        </CardContent>
      </Card>

      {/* Dialog des détails */}
      <InterviewDetailPage
        interview={selectedInterview}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

export default Entretiens;
