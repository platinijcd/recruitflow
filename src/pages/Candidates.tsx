import { useState } from 'react';
import { Plus, Search, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CandidateDetailPage from '@/components/CandidateDetailPage';
import { useCandidates } from '@/hooks/useCandidates';
import StatusBadge from '@/components/StatusBadge';
import { withRefreshOnClose } from '@/components/hoc/withRefreshOnClose';

const CandidateDetailPageWithRefresh = withRefreshOnClose(CandidateDetailPage);

export default function Candidates() {
  // ... existing code until the dialog ...

  return (
    <div className="container mx-auto py-6">
      {/* ... existing code ... */}

      <CandidateDetailPageWithRefresh
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </div>
  );
} 