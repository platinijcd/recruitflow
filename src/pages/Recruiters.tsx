
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRecruiters } from '@/hooks/useRecruiters';
import RecruiterDetailPage from '@/components/RecruiterDetailPage';
import AddRecruiterForm from '@/components/AddRecruiterForm';
import { Plus, Search, Eye, Mail, Phone, Building } from 'lucide-react';

export default function Recruiters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecruiter, setSelectedRecruiter] = useState<any | null>(null);
  const [isAddRecruiterOpen, setIsAddRecruiterOpen] = useState(false);
  const { data: recruiters = [], isLoading: loading } = useRecruiters();

  const filteredRecruiters = recruiters.filter(recruiter =>
    searchQuery 
      ? recruiter.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recruiter.email?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Search and Add Button */}
      <Card className="mb-6 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher par nom ou email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={() => setIsAddRecruiterOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Nouveau recruteur
          </Button>
        </div>
      </Card>

      {/* Recruiters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : filteredRecruiters.length === 0 ? (
          <div className="text-center py-8">Aucun recruteur trouvé</div>
        ) : (
          filteredRecruiters.map((recruiter) => (
            <Card key={recruiter.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{recruiter.name}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{recruiter.email}</span>
                      </div>
                      {recruiter.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">{recruiter.phone}</span>
                        </div>
                      )}
                      {recruiter.role && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building className="h-4 w-4" />
                          <span className="text-sm">{recruiter.role}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRecruiter(recruiter)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" /> Voir
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <RecruiterDetailPage
        recruiter={selectedRecruiter}
        isOpen={!!selectedRecruiter}
        onClose={() => setSelectedRecruiter(null)}
      />

      <AddRecruiterForm
        isOpen={isAddRecruiterOpen}
        onClose={() => setIsAddRecruiterOpen(false)}
      />
    </div>
  );
}
