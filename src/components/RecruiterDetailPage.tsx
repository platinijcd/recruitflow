
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Mail, Phone, Briefcase } from 'lucide-react';

interface RecruiterDetailPageProps {
  recruiter: any;
  isOpen: boolean;
  onClose: () => void;
}

const RecruiterDetailPage = ({ recruiter, isOpen, onClose }: RecruiterDetailPageProps) => {
  if (!recruiter) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Détails du recruteur</h1>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Info */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">{recruiter.name}</h2>
            
            {recruiter.role && (
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-recruit-blue" />
                <span className="text-lg text-gray-700">{recruiter.role}</span>
              </div>
            )}
          </div>

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
                <span>{recruiter.email}</span>
              </div>
              {recruiter.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{recruiter.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecruiterDetailPage;
