
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface AddRecruiterFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRecruiterForm = ({ isOpen, onClose }: AddRecruiterFormProps) => {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const recruiterData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role || null
      };

      const { error } = await supabase
        .from('recruiters')
        .insert(recruiterData);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['recruiters'] });
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: ''
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du recruteur:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un recruteur</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="role">Rôle</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              placeholder="Recruteur, Admin, etc."
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

export default AddRecruiterForm;
