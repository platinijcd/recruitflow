
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePosts } from '@/hooks/usePosts';
import PostDetailPage from '@/components/PostDetailPage';
import AddPostForm from '@/components/AddPostForm';
import { Plus, Search, Eye, MapPin, Building, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Posts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);
  const { data: posts = [], isLoading: loading, refetch } = usePosts();

  const filteredPosts = posts.filter(post =>
    searchQuery 
      ? post.title?.toLowerCase().includes(searchQuery.toLowerCase())
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
              placeholder="Rechercher par titre"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={() => setIsAddPostOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Nouveau poste
          </Button>
        </div>
      </Card>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8">Aucun poste trouvé</div>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {post.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{post.location}</span>
                        </div>
                      )}
                      {post.enterprise && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building className="h-4 w-4" />
                          <span>{post.enterprise}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Créé le {format(new Date(post.created_at), 'PP', { locale: fr })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPost(post)}
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

      <PostDetailPage
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      <AddPostForm
        isOpen={isAddPostOpen}
        onClose={() => setIsAddPostOpen(false)}
        onPostAdded={refetch}
      />
    </div>
  );
}
