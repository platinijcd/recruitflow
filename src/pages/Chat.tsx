import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings } from '@/hooks/useAppSettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';
import ReactMarkdown from 'react-markdown';

type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
type InsertChatMessage = Database['public']['Tables']['chat_messages']['Insert'];

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { settings } = useAppSettings();
  const chatWebhook = settings.find(s => s.setting_key === 'chat_ai_webhook')?.setting_value;

  // Fetch chat history on component mount
  useEffect(() => {
    if (user?.email) {
      fetchChatHistory();
    }
  }, [user?.email]);

  const fetchChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_email', user?.email)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast.error('Error loading chat history');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !user?.email) return;

    if (!chatWebhook) {
      toast.error('Chat webhook URL not configured');
      return;
    }

    const userMessage: InsertChatMessage = {
      role: 'user',
      content: inputMessage,
      user_email: user.email
    };

    try {
      // Save user message to Supabase
      const { error: insertError } = await supabase
        .from('chat_messages')
        .insert([userMessage]);

      if (insertError) throw insertError;

      setMessages(prev => [...prev, userMessage as ChatMessage]);
      setInputMessage('');
      setIsLoading(true);

      // Send message to webhook
      const url = `${chatWebhook}?message=${encodeURIComponent(inputMessage)}`;
      console.log('Sending request to:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      console.log('Response:', data);
      
      const assistantMessage: InsertChatMessage = {
        role: 'assistant',
        content: data,
        user_email: user.email
      };

      // Save assistant message to Supabase
      const { error: assistantError } = await supabase
        .from('chat_messages')
        .insert([assistantMessage]);

      if (assistantError) throw assistantError;

      setMessages(prev => [...prev, assistantMessage as ChatMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur s'est produite");
      
      const errorMessage: InsertChatMessage = {
        role: 'assistant',
        content: "Désolé, une erreur s'est produite lors de l'envoi du message.",
        user_email: user?.email
      };
      setMessages(prev => [...prev, errorMessage as ChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!user?.email) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_email', user.email);

      if (error) throw error;
      
      setMessages([]);
      toast.success('Historique effacé');
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error("Erreur lors de l'effacement de l'historique");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-white border-b rounded-b-lg shadow-sm">
        <div className="w-24"> {/* Empty div for spacing */}</div>
        <h1 className="text-xl font-semibold text-center text-gray-900 uppercase tracking-wide">RecruitFlow AI</h1>
        <Button
          variant="ghost"
          onClick={clearHistory}
          className="text-gray-600 hover:text-red-600 transition-colors"
          disabled={messages.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Effacer
        </Button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.role === 'assistant'
                  ? 'bg-white text-gray-900 border'
                  : 'bg-recruit-blue text-white'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-4 rounded-lg bg-white text-gray-900 border">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t bg-white">
        <Card className="p-2">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Écrivez votre message ici..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-recruit-blue hover:bg-recruit-blue-dark"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
} 