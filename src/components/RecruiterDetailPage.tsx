import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, User, Mail, Phone } from 'lucide-react';
interface RecruiterDetailPageProps {
  recruiter: any;
  isOpen: boolean;
  onClose: () => void;
}
const RecruiterDetailPage = ({
  recruiter,
  isOpen,
  onClose
}: RecruiterDetailPageProps) => {
  if (!recruiter) return null;
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Détails du recruteur</h1>
          
        </div>

        <div className="p-6 space-y-6">
          {/* Recruiter Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-recruit-blue" />
                <span>Informations du recruteur</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium text-lg">{recruiter.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{recruiter.email}</span>
              </div>
              {recruiter.phone && <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{recruiter.phone}</span>
                </div>}
              {recruiter.role && <div>
                  <span className="font-medium">Rôle: </span>
                  <span>{recruiter.role}</span>
                </div>}
              {recruiter.created_at && <div>
                  <span className="font-medium">Date d'ajout: </span>
                  <span>{new Date(recruiter.created_at).toLocaleDateString('fr-FR')}</span>
                </div>}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>;
};
export default RecruiterDetailPage;