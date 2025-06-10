import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from '@/components/StatusBadge';
import type { Interview } from '@/types/interview';
import { X, Trash2, Edit2, Save } from 'lucide-react';
import { useState } from 'react';
import { useInterviews } from '@/hooks/useInterviews';

interface InterviewDetailsDialogProps {
  interview: Interview | null;
  isOpen: boolean;
  onClose: () => void;
}

const InterviewDetailsDialog = ({ interview, isOpen, onClose }: InterviewDetailsDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { deleteInterview, updateInterview } = useInterviews();
  const [editForm, setEditForm] = useState({
    scheduled_at: '',
    location: '',
    interview_status: '',
    feedback: '',
  });

  if (!interview) return null;

  const handleDelete = async () => {
    if (!interview) return;
    
    try {
      setIsDeleting(true);
      await deleteInterview(interview.id);
      onClose();
    } catch (error) {
      console.error('Error deleting interview:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setEditForm({
      scheduled_at: interview.scheduled_at,
      location: interview.location || '',
      interview_status: interview.interview_status,
      feedback: interview.feedback || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!interview) return;
    
    try {
      await updateInterview(interview.id, {
        scheduled_at: editForm.scheduled_at,
        location: editForm.location,
        interview_status: editForm.interview_status as any,
        feedback: editForm.feedback,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating interview:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Détails de l'entretien</h2>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">
                {interview.candidate_name}
              </h3>
              <p className="text-gray-600">Candidat</p>
            </div>
            {isEditing ? (
              <Select
                value={editForm.interview_status}
                onValueChange={(value) => setEditForm(prev => ({ ...prev, interview_status: value }))}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Programmé</SelectItem>
                  <SelectItem value="Retained">Retenu</SelectItem>
                  <SelectItem value="Rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <StatusBadge status={interview.interview_status} />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Poste</h4>
              <p className="text-gray-600">{interview.post_title}</p>
            </div>
            <div>
              <h4 className="font-medium">Recruteur</h4>
              <p className="text-gray-600">{interview.recruiter_name}</p>
            </div>
            <div>
              <h4 className="font-medium">Date et heure</h4>
              {isEditing ? (
                <Input
                  type="datetime-local"
                  value={editForm.scheduled_at}
                  onChange={(e) => setEditForm(prev => ({ ...prev, scheduled_at: e.target.value }))}
                />
              ) : (
                <p className="text-gray-600">
                  {format(new Date(interview.scheduled_at), 'PPpp', { locale: fr })}
                </p>
              )}
            </div>
            <div>
              <h4 className="font-medium">Lieu</h4>
              {isEditing ? (
                <Input
                  value={editForm.location}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Lieu de l'entretien"
                />
              ) : (
                <p className="text-gray-600">{interview.location || 'À définir'}</p>
              )}
            </div>
          </div>

          {(isEditing || interview.feedback) && (
            <div>
              <h4 className="font-medium mb-2">Retour d'entretien</h4>
              {isEditing ? (
                <Textarea
                  value={editForm.feedback}
                  onChange={(e) => setEditForm(prev => ({ ...prev, feedback: e.target.value }))}
                  placeholder="Ajouter un retour d'entretien"
                  rows={4}
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-wrap">{interview.feedback}</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="mt-6 space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Annuler</span>
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Sauvegarder</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex items-center space-x-2"
              >
                <Edit2 className="h-4 w-4" />
                <span>Modifier</span>
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>{isDeleting ? 'Suppression...' : 'Supprimer'}</span>
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewDetailsDialog; 
