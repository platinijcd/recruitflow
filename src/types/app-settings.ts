export interface AppSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_description: string | null;
  setting_category: string;
  created_at: string;
  updated_at: string;
}

export type AppSettingUpdate = Partial<Omit<AppSetting, 'id' | 'created_at' | 'updated_at'>>; 