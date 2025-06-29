import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";

// Notification type
interface Notification {
  id: number;
  item_type: string;
  item_id: number | null;
  message: string;
  created_at: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      // notifications table is not in generated types yet
      const { data, error } = await supabase
        .from('notifications' as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setNotifications(data as unknown as Notification[]);
    };
    fetchNotifications();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications Log</h1>
      <ul>
        {notifications.map((n) => (
          <li key={n.id} className="mb-2 border-b pb-2">
            <div className="font-semibold">{n.message}</div>
            <div className="text-xs text-gray-500">
              {n.item_type} (ID: {n.item_id ?? "N/A"}) — {new Date(n.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 