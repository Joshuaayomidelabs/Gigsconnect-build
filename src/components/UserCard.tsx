import React from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface UserCardProps {
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
    skills?: string[];
    city?: string;
    country?: string;
  };
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  // Add cache buster to avatar URL if it exists
  const avatarUrl = user.avatar_url 
    ? (user.avatar_url.includes('?') ? `${user.avatar_url}&t=${Date.now()}` : `${user.avatar_url}?t=${Date.now()}`)
    : null;

  const location = user.city && user.country 
    ? `${user.city}, ${user.country}` 
    : (user.city || user.country || null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <Link to={`/profile/${user.id}`} className="block p-5">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.full_name}
                className="h-full w-full rounded-full object-cover border-2 border-primary/10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-50">
                <User className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate text-lg">
              {user.full_name}
            </h3>
            {location && (
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {user.skills && user.skills.length > 0 ? (
              user.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-primary/5 text-primary text-xs font-medium rounded-full border border-primary/10"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-xs italic">No skills listed</span>
            )}
            {user.skills && user.skills.length > 3 && (
              <span className="text-gray-400 text-xs self-center">
                +{user.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
