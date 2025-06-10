import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

interface CreateInterviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Candidate = Database['public']['Tables']['candidates']['Row'];
type Recruiter = Database['public']['Tables']['recruiters']['Row'];
type Post = Database['public']['Tables']['posts']['Row'];

const CreateInterviewDialog = ({ isOpen, onClose, onSuccess }: CreateInterviewDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  
  const [formData, setFormData] = useState({
    candidate_id: '',
    recruiter_id: '',
    post_id: '',
    scheduled_at: '',
    location: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [candidatesRes, recruitersRes, postsRes] = await Promise.all([
        supabase.from('candidates').select('*'),
        supabase.from('recruiters').select('*'),
        supabase.from('posts').select('*').eq('post_status', 'Open'),
      ]);

      if (candidatesRes.error) throw candidatesRes.error;
      if (recruitersRes.error) throw recruitersRes.error;
      if (postsRes.error) throw postsRes.error;

      setCandidates(candidatesRes.data);
      setRecruiters(recruitersRes.data);
      setPosts(postsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.candidate_id || !formData.recruiter_id || !formData.post_id || !formData.scheduled_at) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const { error } = await supabase
        .from('interviews')
        .insert({
          ...formData,
          interview_status: 'Scheduled',
        });

      if (error) throw error;

      toast.success('Entretien créé avec succès');
      onSuccess();
      onClose();
      setFormData({
        candidate_id: '',
        recruiter_id: '',
        post_id: '',
        scheduled_at: '',
        location: '',
      });
    } catch (error) {
      console.error('Error creating interview:', error);
      toast.error('Erreur lors de la création de l\'entretien');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un nouvel entretien</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Candidat *
              </label>
              <Select
                value={formData.candidate_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, candidate_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un candidat" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((candidate) => (
                    <SelectItem key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Recruteur *
              </label>
              <Select
                value={formData.recruiter_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, recruiter_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un recruteur" />
                </SelectTrigger>
                <SelectContent>
                  {recruiters.map((recruiter) => (
                    <SelectItem key={recruiter.id} value={recruiter.id}>
                      {recruiter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Poste *
              </label>
              <Select
                value={formData.post_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, post_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un poste" />
                </SelectTrigger>
                <SelectContent>
                  {posts.map((post) => (
                    <SelectItem key={post.id} value={post.id}>
                      {post.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Date et heure *
              </label>
              <Input
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Lieu
              </label>
              <Input
                placeholder="Lieu de l'entretien"
                value={formData.location || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInterviewDialog; 