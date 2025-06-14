import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AppSetting, AppSettingUpdate } from '@/types/app-settings';

export const useAppSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      return data as AppSetting[];
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ id, ...update }: AppSettingUpdate & { id: string }) => {
      const { error } = await supabase
        .from('app_settings')
        .update(update)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-settings'] });
    },
  });

  const getWebhookSettings = () => {
    return settings.filter(setting => setting.setting_category === 'webhooks');
  };

  return {
    settings,
    isLoading,
    updateSetting,
    getWebhookSettings,
  };
}; 