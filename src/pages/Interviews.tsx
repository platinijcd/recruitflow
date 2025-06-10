import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from '@/components/StatusBadge';
import InterviewDetailsDialog from '@/components/InterviewDetailsDialog';
import CreateInterviewDialog from '@/components/CreateInterviewDialog';
import { useInterviews } from '@/hooks/useInterviews';
import type { Interview, InterviewFilters, InterviewStatus } from '@/types/interview';
import { Plus, Search, Eye, Calendar, User2, MapPin, Building } from 'lucide-react';
import { withRefreshOnClose } from '@/components/hoc/withRefreshOnClose';

const InterviewDetailsDialogWithRefresh = withRefreshOnClose(InterviewDetailsDialog);
const CreateInterviewDialogWithRefresh = withRefreshOnClose(CreateInterviewDialog);

export default function Interviews() {
  const [filters, setFilters] = useState<InterviewFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { interviews, loading, updateInterviewStatus, refetch } = useInterviews(filters);

  console.log('Current filters:', filters);
  console.log('Interviews:', interviews);
  console.log('Loading state:', loading);

  const handleStatusChange = (status: InterviewStatus) => {
    console.log('Changing status to:', status);
    setFilters(prev => ({ ...prev, status }));
  };

  // Filter and sort interviews
  const filteredInterviews = interviews
    .filter(interview => 
      searchQuery 
        ? interview.candidate_name?.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher par nom du candidat"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              onValueChange={(value: InterviewStatus) => handleStatusChange(value)}
              value={filters.status}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Scheduled">Programmé</SelectItem>
                <SelectItem value="Retained">Retenu</SelectItem>
                <SelectItem value="Rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Nouvel entretien
          </Button>
        </div>
      </Card>

      {/* Interviews List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : filteredInterviews.length === 0 ? (
          <div className="text-center py-8">Aucun entretien trouvé</div>
        ) : (
          filteredInterviews.map((interview) => (
            <Card
              key={interview.id}
              className="hover:shadow-lg transition-shadow"
            >
              <div className="p-4">
                <div className="flex flex-col">
                  <div className="flex justify-end">
                    <StatusBadge status={interview.interview_status} />
                  </div>
                  <div className="my-2 space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {interview.candidate_name}
                      </h3>
                      <p className="text-base-600 font-italic">
                        {interview.post_title}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(interview.scheduled_at), 'PPpp', { locale: fr })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User2 className="h-4 w-4" />
                        <span>{interview.recruiter_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{interview.location || 'À définir'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedInterview(interview)}
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

      <InterviewDetailsDialogWithRefresh
        interview={selectedInterview}
        isOpen={!!selectedInterview}
        onClose={() => setSelectedInterview(null)}
      />

      <CreateInterviewDialogWithRefresh
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
} 