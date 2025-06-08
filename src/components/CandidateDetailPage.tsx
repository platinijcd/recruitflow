
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Edit, Trash2, FileText, Linkedin, Mail, Phone, Star, User, Briefcase, Award } from 'lucide-react';
import { useUpdateCandidate } from '@/hooks/useCandidates';
import { usePosts } from '@/hooks/usePosts';
import { useRecruiters } from '@/hooks/useRecruiters';
import { supabase } from '@/integrations/supabase/client';

interface CandidateDetailPageProps {
  candidate: any;
  isOpen: boolean;
  onClose: () => void;
}

const CandidateDetailPage = ({ candidate, isOpen, onClose }: CandidateDetailPageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState(candidate?.application_status || 'To Be Reviewed');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { mutate: updateCandidate } = useUpdateCandidate();
  const { data: posts = [] } = usePosts();
  const { data: recruiters = [] } = useRecruiters();

  if (!candidate) return null;

  const getPost = () => {
    return posts.find(post => post.id === candidate.post_id);
  };

  const getRecruiter = () => {
    return recruiters.find(recruiter => recruiter.id === candidate.interviewer_id);
  };

  const renderStars = (score?: number) => {
    if (!score) return null;
    const starRating = (score / 10) * 5;
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 >= 0.5;
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-5 w-5 ${
              i < fullStars ? 'text-yellow-400 fill-current' : 
              i === fullStars && hasHalfStar ? 'text-yellow-400 fill-current' :
              'text-gray-300'
            }`} 
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">{score}/10</span>
      </div>
    );
  };

  const handleSave = () => {
    updateCandidate({
      id: candidate.id,
      updates: { application_status: editedStatus }
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', candidate.id);
      
      if (error) throw error;
      
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)} 
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Modifier</span>
            </Button>
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
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Info */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
            
            {candidate.relevance_score && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Score de pertinence</h3>
                {renderStars(candidate.relevance_score)}
              </div>
            )}
            
            {candidate.score_justification && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Justification du score</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{candidate.score_justification}</p>
              </div>
            )}

            <div className="flex space-x-3">
              {candidate.cv_link && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open(candidate.cv_link, '_blank')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Voir CV
                </Button>
              )}
              {candidate.linkedin_url && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open(candidate.linkedin_url, '_blank')}
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
              )}
            </div>
          </div>

          {/* Candidature Section */}
          <Card>
            <CardHeader>
              <CardTitle>Candidature</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Poste souhaité: </span>
                <span>{candidate.desired_position}</span>
              </div>
              <div>
                <span className="font-medium">Poste: </span>
                <span>{getPost()?.title || 'Non spécifié'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-medium">Statut: </span>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <Select value={editedStatus} onValueChange={setEditedStatus}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="To Be Reviewed">À réviser</SelectItem>
                        <SelectItem value="Relevant">Pertinent</SelectItem>
                        <SelectItem value="Rejectable">À rejeter</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={handleSave}>Sauvegarder</Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                  </div>
                ) : (
                  <Badge>
                    {candidate.application_status === 'To Be Reviewed' ? 'À réviser' : 
                     candidate.application_status === 'Relevant' ? 'Pertinent' : 'À rejeter'}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-recruit-blue" />
                <span>Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{candidate.email}</span>
              </div>
              {candidate.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{candidate.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-recruit-blue" />
                <span>Informations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidate.profile_summary && (
                <div>
                  <h4 className="font-semibold mb-2">Résumé du profil</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{candidate.profile_summary}</p>
                </div>
              )}

              {candidate.experiences && candidate.experiences.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Expériences</h4>
                  <div className="space-y-3">
                    {candidate.experiences.map((exp: any, index: number) => (
                      <div key={index} className="border-l-4 border-recruit-blue pl-4">
                        <div className="font-medium">{exp.position}</div>
                        <div className="text-sm text-gray-600">{exp.company} • {exp.duration}</div>
                        {exp.missions && <div className="text-sm text-gray-700 mt-1">{exp.missions}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {candidate.degrees && candidate.degrees.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Diplômes</h4>
                  <div className="space-y-2">
                    {candidate.degrees.map((degree: any, index: number) => (
                      <div key={index} className="border-l-4 border-recruit-green pl-4">
                        <div className="font-medium">{degree.title}</div>
                        <div className="text-sm text-gray-600">{degree.institution}</div>
                        {degree.specialization && <div className="text-sm text-gray-700">{degree.specialization}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {candidate.certifications && candidate.certifications.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.certifications.map((cert: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <Award className="h-3 w-3" />
                        <span>{cert}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {candidate.skills && candidate.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Compétences</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <Briefcase className="h-3 w-3" />
                        <span>{skill}</span>
                      </Badge>
                    ))}
                  </div>
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
              <p className="mb-6">Êtes-vous sûr de bien vouloir supprimer cette candidature ?</p>
              <div className="flex space-x-3">
                <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Oui
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

export default CandidateDetailPage;
