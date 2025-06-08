import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Plus, MapPin, Building, Users, Eye, Briefcase } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { useCandidates } from '@/hooks/useCandidates';
import PostDetailPage from '@/components/PostDetailPage';
import AddPostForm from '@/components/AddPostForm';

const Postes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  
  const { data: posts = [], isLoading: postsLoading } = usePosts();
  const { data: candidates = [], isLoading: candidatesLoading } = useCandidates();

  const getCandidateCount = (postId: string) => {
    return candidates.filter(c => c.post_id === postId).length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-recruit-green text-white';
      case 'Close': return 'bg-recruit-red text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || post.post_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (post: any) => {
    setSelectedPost(post);
    setIsDetailOpen(true);
  };

  if (postsLoading || candidatesLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filtres et boutons sur la même ligne */}
      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
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
                  <SelectItem value="Open">Ouvert</SelectItem>
                  <SelectItem value="Close">Fermé</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }} className="rounded-lg">
                Réinitialiser
              </Button>
            </div>

            <Button 
              className="bg-recruit-blue hover:bg-recruit-blue-dark"
              onClick={() => setIsAddFormOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer un poste
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des postes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                  <p className="text-gray-600 mt-1 line-clamp-2">{post.description}</p>
                </div>
                <Badge className={getStatusColor(post.post_status)}>
                  {post.post_status === 'Open' ? 'Ouvert' : 'Fermé'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Détails du poste */}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {post.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{post.location}</span>
                    </div>
                  )}
                  {post.enterprise && (
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>{post.enterprise}</span>
                    </div>
                  )}
                  {post.department && (
                    <div className="flex items-center space-x-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{post.department}</span>
                    </div>
                  )}
                </div>

                {/* Statistiques */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-recruit-blue" />
                    <span className="text-lg font-semibold text-recruit-blue">
                      {getCandidateCount(post.id)}
                    </span>
                    <span className="text-sm text-gray-600">candidatures</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDetails(post)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                  </div>
                </div>

                {/* Date de création */}
                <div className="text-xs text-gray-500">
                  Créé le {new Date(post.created_at || '').toLocaleDateString('fr-FR')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message si aucun résultat */}
      {filteredPosts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Aucun poste ne correspond à vos critères de recherche.</p>
          </CardContent>
        </Card>
      )}

      {/* Statistiques en bas */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredPosts.length} poste{filteredPosts.length > 1 ? 's' : ''} affiché{filteredPosts.length > 1 ? 's' : ''}</span>
            <span>Total: {posts.length} postes</span>
          </div>
        </CardContent>
      </Card>

      {/* Dialog des détails */}
      <PostDetailPage
        post={selectedPost}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* Formulaire d'ajout */}
      <AddPostForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
      />
    </div>
  );
};

export default Postes;
