
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Mail, Phone, MoreVertical, Filter } from 'lucide-react';
import { useRecruiters } from '@/hooks/useRecruiters';

const Recruteurs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: recruiters = [], isLoading } = useRecruiters();

  const filteredRecruiters = recruiters.filter(recruiter => 
    recruiter.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recruiter.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-recruit-blue text-white';
      case 'Recruiter': return 'bg-recruit-green text-white';
      case 'Manager': return 'bg-recruit-orange text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (isLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Statistiques en haut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-recruit-blue">{recruiters.length}</p>
              <p className="text-sm text-gray-600">Total recruteurs</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-recruit-green">
                {recruiters.filter(r => r.role === 'Admin').length}
              </p>
              <p className="text-sm text-gray-600">Administrateurs</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-recruit-orange">
                {recruiters.filter(r => r.role === 'Recruiter' || !r.role).length}
              </p>
              <p className="text-sm text-gray-600">Recruteurs actifs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et boutons sur la même ligne */}
      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Rechercher:</span>
              </div>
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg"
                />
              </div>
            </div>

            <Button className="bg-recruit-blue hover:bg-recruit-blue-dark">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un recruteur
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des recruteurs */}
      <Card>
        <CardHeader>
          <CardTitle>Équipe ({filteredRecruiters.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recruteur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date d'ajout</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecruiters.map((recruiter) => (
                <TableRow key={recruiter.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-recruit-blue text-white">
                          {getInitials(recruiter.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {recruiter.name}
                        </p>
                        <p className="text-sm text-gray-600">{recruiter.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(recruiter.role || 'Recruiter')}>
                      {recruiter.role || 'Recruiter'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{recruiter.email}</span>
                      </div>
                      {recruiter.phone && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{recruiter.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {recruiter.created_at ? new Date(recruiter.created_at).toLocaleDateString('fr-FR') : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredRecruiters.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun recruteur ne correspond à votre recherche.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Recruteurs;
