import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, User, Calendar, MapPin, Building, Search, Briefcase, Save, ArrowLeft } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';
import { useUpdatePost, useDeletePost } from '@/hooks/usePosts';
import { supabase } from '@/integrations/supabase/client';
import CandidatureCard from '@/components/CandidatureCard';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
    title: '',
    description: '',
    location: '',
    enterprise: '',
    department: '',
    post_status: 'Open'
  });

  const { data: candidates = [] } = useCandidates();
  const { mutate: updatePost } = useUpdatePost();
  const { mutate: deletePost } = useDeletePost();

  // Update editedPost when post prop changes
  useEffect(() => {
    if (post) {
      setEditedPost({
        title: post.title || '',
        description: post.description || '',
        location: post.location || '',
        enterprise: post.enterprise || '',
        department: post.department || '',
        post_status: post.post_status || 'Open'
      });
    }
  }, [post]);

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
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const toggleStatus = () => {
    const newStatus = editedPost.post_status === 'Open' ? 'Close' : 'Open';
    setEditedPost(prev => ({ ...prev, post_status: newStatus }));
    updatePost({
      id: post.id,
      updates: { post_status: newStatus }
    });
  };

  const handleSave = () => {
    updatePost({
      id: post.id,
      updates: editedPost
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setEditedPost({
      title: post.title || '',
      description: post.description || '',
      location: post.location || '',
      enterprise: post.enterprise || '',
      department: post.department || '',
      post_status: post.post_status || 'Open'
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pr-16 border-b">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Détails du poste</h1>
          </div>
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm" className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Sauvegarder</span>
                </Button>
                <Button variant="outline" onClick={handleCancel} size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Annuler</span>
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
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

        <div className="p-5 space-y-5">
          {/* Post Info Card - EDITABLE */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-recruit-blue" />
                <span>Informations du poste</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {isEditing ? (
                    <Input
                      value={editedPost.title}
                      onChange={(e) => setEditedPost({...editedPost, title: e.target.value})}
                      placeholder="Titre du poste"
                    />
                  ) : (
                    post.title
                  )}
                </h2>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge 
                    className={`${getStatusColor(editedPost.post_status)} cursor-pointer`}
                    onClick={toggleStatus}
                  >
                    {editedPost.post_status === 'Open' ? 'Ouvert' : 'Fermé'}
                  </Badge>
                  {!isEditing && (
                    <span className="text-xs text-gray-500">(Cliquer pour changer le statut)</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-sm text-gray-700 mb-2 block">
                    <Building className="h-4 w-4 inline mr-2" />
                    Entreprise
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedPost.enterprise}
                      onChange={(e) => setEditedPost({...editedPost, enterprise: e.target.value})}
                      placeholder="Nom de l'entreprise"
                    />
                  ) : (
                    <p className="text-gray-900">{post.enterprise || 'Non spécifié'}</p>
                  )}
                </div>

                <div>
                  <label className="font-medium text-sm text-gray-700 mb-2 block">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Localisation
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedPost.location}
                      onChange={(e) => setEditedPost({...editedPost, location: e.target.value})}
                      placeholder="Localisation"
                    />
                  ) : (
                    <p className="text-gray-900">{post.location || 'Non spécifié'}</p>
                  )}
                </div>

                <div>
                  <label className="font-medium text-sm text-gray-700 mb-2 block">
                    <Briefcase className="h-4 w-4 inline mr-2" />
                    Département
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedPost.department}
                      onChange={(e) => setEditedPost({...editedPost, department: e.target.value})}
                      placeholder="Département"
                    />
                  ) : (
                    <p className="text-gray-900">{post.department || 'Non spécifié'}</p>
                  )}
                </div>

                <div>
                  <label className="font-medium text-sm text-gray-700 mb-2 block">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Date de création
                  </label>
                  <p className="text-gray-900">
                    {post.created_at ? format(new Date(post.created_at), 'PPP', { locale: fr }) : 'Non spécifié'}
                  </p>
                </div>
              </div>

              <div>
                <label className="font-medium text-sm text-gray-700 mb-2 block">Description</label>
                {isEditing ? (
                  <Textarea
                    value={editedPost.description}
                    onChange={(e) => setEditedPost({...editedPost, description: e.target.value})}
                    placeholder="Description du poste"
                    rows={6}
                  />
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                    {post.description || 'Aucune description disponible'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Candidates Section - READ ONLY */}
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
                        titre_poste: candidate.post?.title,
                        statut: candidate.application_status,
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
