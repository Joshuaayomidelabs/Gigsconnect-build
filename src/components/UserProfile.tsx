import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { supabase } from "../services/supabaseClient";

interface UserProfileProps {
  userId: string;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1️⃣ Initial fetch
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) console.error("Error fetching user:", error);
      else setUser(data);
    };

    fetchUser();

    // 2️⃣ Realtime subscription (Supabase v2 syntax)
    const channel = supabase
      .channel(`profile-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          setUser(payload.new);
        }
      )
      .subscribe();

    // 3️⃣ Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (!user) return <div className="p-2 text-gray-500 text-sm">Loading user...</div>;

  const isVerified = user.verification_status === 'Verified';

  return (
    <div className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Avatar */}
      {user.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={user.full_name}
          className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
          <span className="text-gray-400 text-xs font-bold">
            {user.full_name?.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <div className="flex items-center space-x-1.5">
        <span className="font-semibold text-gray-800 dark:text-gray-100">{user.full_name}</span>
        {isVerified && (
          <span title="Verified">
            <CheckCircle
              className="w-4 h-4 text-brand-purple"
            />
          </span>
        )}
      </div>
    </div>
  );
}
