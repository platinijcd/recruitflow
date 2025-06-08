
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface AddPostFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPostForm = ({ isOpen, onClose }: AddPostFormProps) => {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    enterprise: '',
    department: '',
    post_status: 'Open' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const postData = {
        title: formData.title,
        description: formData.description || null,
        location: formData.location || null,
        enterprise: formData.enterprise || null,
        department: formData.department || null,
        post_status: formData.post_status
      };

      const { error } = await supabase
        .from('posts')
        .insert(postData);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        enterprise: '',
        department: '',
        post_status: 'Open'
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du poste:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un poste</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre du poste *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="enterprise">Entreprise</Label>
              <Input
                id="enterprise"
                value={formData.enterprise}
                onChange={(e) => setFormData({...formData, enterprise: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Département</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="post_status">Statut</Label>
              <Select value={formData.post_status} onValueChange={(value) => setFormData({...formData, post_status: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Ouvert</SelectItem>
                  <SelectItem value="Close">Fermé</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

export default AddPostForm;
