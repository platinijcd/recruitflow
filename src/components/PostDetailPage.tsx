
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Briefcase, Calendar, MapPin, Building, Search, Edit, Trash2, Save, XIcon } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';
import { useUpdatePost, useDeletePost } from '@/hooks/usePosts';
import { supabase } from '@/integrations/supabase/client';
import CandidatureCard from './CandidatureCard';

interface PostDetailPageProps {
  post: any;
  isOpen: boolean;
  onClose: () => void;
}

const PostDetailPage = ({ post, isOpen, onClose }: PostDetailPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedPost, setEditedPost] = useState({
    title: post?.title || '',
    description: post?.description || '',
    location: post?.location || '',
    enterprise: post?.enterprise || '',
    department: post?.department || ''
  });

  const { data: candidates = [] } = useCandidates();
  const { mutate: updatePost } = useUpdatePost();
  const { mutate: deletePost } = useDeletePost();

  if (!post) return null;

  const postCandidates = candidates.filter(candidate => candidate.post_id === post.id);
  const filteredCandidates = postCandidates.filter(candidate => 
    candidate.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-recruit-green text-white';
      case 'Close':
        return 'bg-recruit-red text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleSave = () => {
    updatePost({
      id: post.id,
      updates: editedPost
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPost({
      title: post?.title || '',
      description: post?.description || '',
      location: post?.location || '',
      enterprise: post?.enterprise || '',
      department: post?.department || ''
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deletePost(post.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Détails du poste</h1>
          <div className="flex space-x-2">
            {!isEditing && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Modifier</span>
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Supprimer</span>
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Post Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-recruit-blue" />
                <span>Informations du poste</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                {isEditing ? (
                  <Input
                    value={editedPost.title}
                    onChange={(e) => setEditedPost({...editedPost, title: e.target.value})}
                    placeholder="Titre du poste"
                    className="text-2xl font-bold"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
                )}
              </div>
              
              {(post.description || isEditing) && (
                <div>
                  <span className="font-medium">Description: </span>
                  {isEditing ? (
                    <Textarea
                      value={editedPost.description}
                      onChange={(e) => setEditedPost({...editedPost, description: e.target.value})}
                      placeholder="Description du poste"
                      className="mt-1"
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">{post.description}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium text-sm">Date de création</span>
                    <p className="text-sm text-gray-600">
                      {post.created_at ? new Date(post.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium text-sm">Lieu</span>
                    {isEditing ? (
                      <Input
                        value={editedPost.location}
                        onChange={(e) => setEditedPost({...editedPost, location: e.target.value})}
                        placeholder="Lieu"
                        className="text-sm mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">{post.location || 'Non spécifié'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium text-sm">Entreprise</span>
                    {isEditing ? (
                      <Input
                        value={editedPost.enterprise}
                        onChange={(e) => setEditedPost({...editedPost, enterprise: e.target.value})}
                        placeholder="Entreprise"
                        className="text-sm mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">{post.enterprise || 'Non spécifié'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="font-medium text-sm">Département</span>
                    {isEditing ? (
                      <Input
                        value={editedPost.department}
                        onChange={(e) => setEditedPost({...editedPost, department: e.target.value})}
                        placeholder="Département"
                        className="text-sm mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">{post.department || 'Non spécifié'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <span className="font-medium">Statut: </span>
                <Badge className={getStatusColor(post.post_status)}>
                  {post.post_status === 'Open' ? 'Ouvert' : 'Fermé'}
                </Badge>
              </div>

              {isEditing && (
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <XIcon className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Candidates Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Candidatures liées ({postCandidates.length})</span>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredCandidates.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredCandidates.map(candidate => (
                    <CandidatureCard
                      key={candidate.id}
                      candidature={{
                        id: candidate.id,
                        nom: candidate.name || '',
                        email: candidate.email,
                        telephone: candidate.phone || '',
                        lien_linkedin: candidate.linkedin_url || undefined,
                        poste_souhaite: candidate.desired_position || '',
                        statut: candidate.application_status === 'To Be Reviewed' ? 'A évaluer' : 
                               candidate.application_status === 'Relevant' ? 'Pertinent' : 'Rejeté',
                        date_reception: candidate.application_date || '',
                        note: candidate.relevance_score || undefined,
                        commentaire_evaluateur: candidate.score_justification || undefined,
                        competences: Array.isArray(candidate.skills) ? candidate.skills as string[] : undefined,
                        experience_annees: undefined
                      }}
                      onViewDetails={() => {}}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchTerm ? 'Aucune candidature ne correspond à votre recherche.' : 'Aucune candidature pour ce poste.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md">
              <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
              <p className="mb-6">Êtes-vous sûr de bien vouloir supprimer ce poste ? Cette action supprimera également toutes les candidatures associées.</p>
              <div className="flex space-x-3">
                <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Oui, supprimer
                </Button>
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PostDetailPage;
