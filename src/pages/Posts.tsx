import { useState } from 'react';
import { Plus, Search, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PostDetailPage from '@/components/PostDetailPage';
import AddPostForm from '@/components/AddPostForm';
import { usePosts } from '@/hooks/usePosts';
import { withRefreshOnClose } from '@/components/hoc/withRefreshOnClose';

const PostDetailPageWithRefresh = withRefreshOnClose(PostDetailPage);
const AddPostFormWithRefresh = withRefreshOnClose(AddPostForm);

export default function Posts() {
  // ... existing code until the dialogs ...

  return (
    <div className="container mx-auto py-6">
      {/* ... existing code ... */}

      <PostDetailPageWithRefresh
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      <AddPostFormWithRefresh
        isOpen={isAddPostOpen}
        onClose={() => setIsAddPostOpen(false)}
      />
    </div>
  );
} 