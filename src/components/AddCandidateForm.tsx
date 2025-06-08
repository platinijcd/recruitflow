
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { usePosts } from '@/hooks/usePosts';
import { useRecruiters } from '@/hooks/useRecruiters';
import { useQueryClient } from '@tanstack/react-query';

interface AddCandidateFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCandidateForm = ({ isOpen, onClose }: AddCandidateFormProps) => {
  const queryClient = useQueryClient();
  const { data: posts = [] } = usePosts();
  const { data: recruiters = [] } = useRecruiters();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    cv_url: '',
    profile_summary: '',
    desired_position: '',
    application_status: 'To Be Reviewed' as const,
    post_id: '',
    recruiter_assigned: '',
    relevance_score: '',
    score_justification: '',
    experiences: '',
    degrees: '',
    skills: '',
    certifications: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const candidateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        linkedin_url: formData.linkedin_url || null,
        cv_url: formData.cv_url || null,
        profile_summary: formData.profile_summary || null,
        desired_position: formData.desired_position || null,
        application_status: formData.application_status,
        post_id: formData.post_id || null,
        recruiter_assigned: formData.recruiter_assigned || null,
        relevance_score: formData.relevance_score ? parseInt(formData.relevance_score) : null,
        score_justification: formData.score_justification || null,
        experiences: formData.experiences ? [formData.experiences] : null,
        degrees: formData.degrees ? [formData.degrees] : null,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : null,
        certifications: formData.certifications ? [formData.certifications] : null
      };

      const { error } = await supabase
        .from('candidates')
        .insert(candidateData);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        linkedin_url: '',
        cv_url: '',
        profile_summary: '',
        desired_position: '',
        application_status: 'To Be Reviewed',
        post_id: '',
        recruiter_assigned: '',
        relevance_score: '',
        score_justification: '',
        experiences: '',
        degrees: '',
        skills: '',
        certifications: ''
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du candidat:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un candidat</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="desired_position">Poste souhaité</Label>
              <Input
                id="desired_position"
                value={formData.desired_position}
                onChange={(e) => setFormData({...formData, desired_position: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="application_status">Statut</Label>
              <Select value={formData.application_status} onValueChange={(value) => setFormData({...formData, application_status: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Be Reviewed">À réviser</SelectItem>
                  <SelectItem value="Relevant">Pertinent</SelectItem>
                  <SelectItem value="Rejectable">À rejeter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="post_id">Poste associé</Label>
              <Select value={formData.post_id} onValueChange={(value) => setFormData({...formData, post_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un poste" />
                </SelectTrigger>
                <SelectContent>
                  {posts.map(post => (
                    <SelectItem key={post.id} value={post.id}>{post.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="recruiter_assigned">Recruteur assigné</Label>
              <Select value={formData.recruiter_assigned} onValueChange={(value) => setFormData({...formData, recruiter_assigned: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un recruteur" />
                </SelectTrigger>
                <SelectContent>
                  {recruiters.map(recruiter => (
                    <SelectItem key={recruiter.id} value={recruiter.id}>{recruiter.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="relevance_score">Score de pertinence (0-100)</Label>
              <Input
                id="relevance_score"
                type="number"
                min="0"
                max="100"
                value={formData.relevance_score}
                onChange={(e) => setFormData({...formData, relevance_score: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="cv_url">Lien CV</Label>
              <Input
                id="cv_url"
                value={formData.cv_url}
                onChange={(e) => setFormData({...formData, cv_url: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="profile_summary">Résumé du profil</Label>
            <Textarea
              id="profile_summary"
              value={formData.profile_summary}
              onChange={(e) => setFormData({...formData, profile_summary: e.target.value})}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="score_justification">Justification du score</Label>
            <Textarea
              id="score_justification"
              value={formData.score_justification}
              onChange={(e) => setFormData({...formData, score_justification: e.target.value})}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="skills">Compétences (séparées par des virgules)</Label>
            <Input
              id="skills"
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
              placeholder="React, JavaScript, TypeScript..."
            />
          </div>
          
          <div>
            <Label htmlFor="experiences">Expériences</Label>
            <Textarea
              id="experiences"
              value={formData.experiences}
              onChange={(e) => setFormData({...formData, experiences: e.target.value})}
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="degrees">Diplômes</Label>
            <Textarea
              id="degrees"
              value={formData.degrees}
              onChange={(e) => setFormData({...formData, degrees: e.target.value})}
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="certifications">Certifications</Label>
            <Textarea
              id="certifications"
              value={formData.certifications}
              onChange={(e) => setFormData({...formData, certifications: e.target.value})}
              rows={2}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCandidateForm;
