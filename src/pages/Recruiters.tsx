import { useState } from 'react';
import { Plus, Search, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RecruiterDetailPage from '@/components/RecruiterDetailPage';
import AddRecruiterForm from '@/components/AddRecruiterForm';
import { useRecruiters } from '@/hooks/useRecruiters';
import { withRefreshOnClose } from '@/components/hoc/withRefreshOnClose';

const RecruiterDetailPageWithRefresh = withRefreshOnClose(RecruiterDetailPage);
const AddRecruiterFormWithRefresh = withRefreshOnClose(AddRecruiterForm);

export default function Recruiters() {
  // ... existing code until the dialogs ...

  return (
    <div className="container mx-auto py-6">
      {/* ... existing code ... */}

      <RecruiterDetailPageWithRefresh
        recruiter={selectedRecruiter}
        isOpen={!!selectedRecruiter}
        onClose={() => setSelectedRecruiter(null)}
      />

      <AddRecruiterFormWithRefresh
        isOpen={isAddRecruiterOpen}
        onClose={() => setIsAddRecruiterOpen(false)}
      />
    </div>
  );
} 