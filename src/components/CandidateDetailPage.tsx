
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, FileText, Linkedin, Mail, Phone, User, Briefcase, Award, Save, ArrowLeft, Star } from 'lucide-react';
import { useUpdateCandidate } from '@/hooks/useCandidates';
import { usePosts } from '@/hooks/usePosts';
import { useRecruiters } from '@/hooks/useRecruiters';
import { supabase } from '@/integrations/supabase/client';
import StatusBadge from './StatusBadge';
import CircleScore from './CircleScore';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import type { Database } from '@/integrations/supabase/types';

type ApplicationStatus = Database['public']['Enums']['application_status'];

interface CandidateDetailPageProps {
  candidate: any;
  isOpen: boolean;
  onClose: () => void;
}

const CandidateDetailPage = ({
  candidate,
  isOpen,
  onClose
}: CandidateDetailPageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCandidate, setEditedCandidate] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    desired_position: '',
    application_status: 'To Be Reviewed' as ApplicationStatus,
    post_id: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { mutate: updateCandidate } = useUpdateCandidate();
  const { data: posts = [] } = usePosts();
  const { data: recruiters = [] } = useRecruiters();

  // Update editedCandidate when candidate prop changes
  useEffect(() => {
    if (candidate) {
      setEditedCandidate({
        name: candidate.name || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        linkedin_url: candidate.linkedin_url || '',
        desired_position: candidate.desired_position || '',
        application_status: candidate.application_status || 'To Be Reviewed' as ApplicationStatus,
        post_id: candidate.post_id || ''
      });
    }
  }, [candidate]);

  const renderScore = (score?: number) => {
    if (!score) return null;
    
    return (
      <div className="flex items-center space-x-4">
        <CircleScore score={score} size={50} />
        <div>
          <p className="text-sm font-medium text-gray-600">Score de pertinence</p>
          <p className="text-xs text-gray-500">Sur une échelle de 0 à 10</p>
        </div>
      </div>
    );
  };

  if (!candidate) return null;

  const getPost = () => {
    return posts.find(post => post.id === candidate.post_id);
  };

  const getRecruiter = () => {
    return recruiters.find(recruiter => recruiter.id === candidate.interviewer_id);
  };

  const handleSave = () => {
    updateCandidate({
      id: candidate.id,
      updates: editedCandidate
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setEditedCandidate({
      name: candidate.name || '',
      email: candidate.email || '',
      phone: candidate.phone || '',
      linkedin_url: candidate.linkedin_url || '',
      desired_position: candidate.desired_position || '',
      application_status: candidate.application_status || 'To Be Reviewed' as ApplicationStatus,
      post_id: candidate.post_id || ''
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

  const getStatusBadgeProps = (status: ApplicationStatus) => {
    return status;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pr-16 border-b">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Détails du candidat</h1>
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
            {/* Main Info */}
            <div className="space-y-4">
              {isEditing ? (
                <Input
                  value={editedCandidate.name}
                  onChange={(e) => setEditedCandidate({...editedCandidate, name: e.target.value})}
                  className="text-3xl font-bold"
                  placeholder="Nom du candidat"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
              )}
              
              <div className="flex space-x-3">
                {candidate.cv_url && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(candidate.cv_url, '_blank')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Voir CV
                  </Button>
                )}
                {isEditing ? (
                  <Input
                    value={editedCandidate.linkedin_url}
                    onChange={(e) => setEditedCandidate({...editedCandidate, linkedin_url: e.target.value})}
                    placeholder="URL LinkedIn"
                    className="w-64"
                  />
                ) : candidate.linkedin_url && (
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

            {/* Score de pertinence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Score de pertinence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.relevance_score !== null && candidate.relevance_score !== undefined && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <CircleScore score={candidate.relevance_score} size={50} />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Score de pertinence</p>
                        <p className="text-xs text-gray-500">Sur une échelle de 0 à 10</p>
                      </div>
                    </div>
                    
                    {candidate.score_justification && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Justification:</p>
                        <p className="text-sm bg-gray-50 p-3 rounded-lg">{candidate.score_justification}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Candidature Section - EDITABLE */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Candidature</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Poste souhaité: </span>
                  {isEditing ? (
                    <Select value={editedCandidate.post_id} onValueChange={(value) => setEditedCandidate({...editedCandidate, post_id: value})}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Sélectionner un poste" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {posts.map(post => (
                          <SelectItem key={post.id} value={post.id}>
                            {post.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span>{getPost()?.title || 'Non spécifié'}</span>
                  )}
                </div>
                
                <div>
                  <span className="font-medium">Statut: </span>
                  {isEditing ? (
                    <Select value={editedCandidate.application_status} onValueChange={(value) => setEditedCandidate({...editedCandidate, application_status: value as ApplicationStatus})}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="To Be Reviewed">À réviser</SelectItem>
                        <SelectItem value="Relevant">Pertinent</SelectItem>
                        <SelectItem value="Rejectable">À rejeter</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <StatusBadge status={candidate.application_status} />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Section - READ ONLY */}
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
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{candidate.phone || 'Non spécifié'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Informations Section - READ ONLY */}
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
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce candidat ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées à ce candidat seront définitivement supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CandidateDetailPage;
