import React from 'react';
import { MessageCircle, Search, User, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const Messages: React.FC = () => {
  const conversations = [
    { id: 1, name: 'Burna Boy', lastMessage: 'Yo, that beat is fire! Let\'s collab.', time: '2m ago', unread: true, avatar: 'B' },
    { id: 2, name: 'Tiwa Savage', lastMessage: 'Are you available for the gig on Friday?', time: '1h ago', unread: false, avatar: 'T' },
    { id: 3, name: 'Wizkid', lastMessage: 'Send me the stems when you can.', time: '3h ago', unread: false, avatar: 'W' },
    { id: 4, name: 'Davido', lastMessage: 'The session was great, thanks!', time: '1d ago', unread: false, avatar: 'D' },
  ];

  return (
    <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto min-h-screen bg-brand-gray">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-brand-black tracking-tight">Messages</h1>
        <p className="text-brand-gray-dark text-sm">Connect with other musicians</p>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm border border-brand-purple-light/10 overflow-hidden">
        <div className="p-4 border-b border-brand-purple-light/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-dark" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-10 pr-4 py-2 bg-brand-gray rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all"
            />
          </div>
        </div>

        <div className="divide-y divide-brand-purple-light/5">
          {conversations.map((chat, i) => (
            <motion.div 
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 flex items-center gap-4 hover:bg-brand-purple-soft/30 cursor-pointer transition-colors group"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-brand-purple-light flex items-center justify-center text-brand-purple font-bold text-lg border-2 border-white shadow-sm">
                  {chat.avatar}
                </div>
                {chat.unread && (
                  <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-brand-purple rounded-full border-2 border-white" />
                )}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className={`text-sm font-bold truncate ${chat.unread ? 'text-brand-black' : 'text-brand-gray-dark'}`}>
                    {chat.name}
                  </h3>
                  <span className="text-[10px] text-brand-gray-dark whitespace-nowrap">{chat.time}</span>
                </div>
                <p className={`text-xs truncate ${chat.unread ? 'text-brand-black font-medium' : 'text-brand-gray-dark'}`}>
                  {chat.lastMessage}
                </p>
              </div>

              <ArrowRight className="w-4 h-4 text-brand-purple opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-6 bg-brand-purple-soft/50 rounded-[2rem] border border-brand-purple-light/20 text-center">
        <MessageCircle className="w-8 h-8 text-brand-purple mx-auto mb-2 opacity-50" />
        <p className="text-xs text-brand-gray-dark font-medium">Looking for someone to collaborate with?</p>
        <button className="mt-3 text-brand-purple font-bold text-sm hover:underline">Start a new chat</button>
      </div>
    </div>
  );
};

export default Messages;
