import { useState } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Settings() {
  const { getWebhookSettings, updateSetting, isLoading, settings } = useAppSettings();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const webhookSettings = getWebhookSettings();

  const handleEdit = (id: string, currentValue: string) => {
    setEditingId(id);
    setEditValue(currentValue);
  };

  const handleSave = async (id: string) => {
    try {
      await updateSetting.mutateAsync({
        id,
        setting_value: editValue,
      });
      setEditingId(null);
      setEditValue('');
      toast.success('Webhook URL updated successfully');
    } catch (error) {
      toast.error('Failed to update webhook URL');
      console.error('Error updating webhook:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  if (isLoading) {
    return <div className="p-4">Loading settings...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Webhook Settings</CardTitle>
            <CardDescription>
              Manage webhook URLs for different integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {webhookSettings.map((setting) => (
                <div key={setting.id} className="space-y-2">
                  <div className="font-medium">{setting.setting_key}</div>
                  {setting.setting_description && (
                    <div className="text-sm text-gray-500">
                      {setting.setting_description}
                    </div>
                  )}
                  <div className="flex gap-2">
                    {editingId === setting.id ? (
                      <>
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          placeholder="Enter webhook URL"
                          className="flex-1"
                        />
                        <Button
                          variant="default"
                          onClick={() => handleSave(setting.id)}
                          disabled={updateSetting.isPending}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          disabled={updateSetting.isPending}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Input
                          value={setting.setting_value}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(setting.id, setting.setting_value)}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 