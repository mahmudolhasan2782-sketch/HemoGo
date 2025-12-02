import React, { useState } from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, Share2, PlusSquare, MoreHorizontal, Bell, Zap } from 'lucide-react';

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    userId: 'u2',
    userName: 'Sarah Chen',
    userAvatar: 'https://picsum.photos/100/100?random=1',
    content: 'Just finished the Module on Balance Sheets! 📚 The new quiz feature is amazing. #HemoGo #Accounting',
    image: 'https://picsum.photos/500/300?random=2',
    likes: 24,
    comments: 5,
    timestamp: '2h ago'
  },
  {
    id: '2',
    userId: 'u3',
    userName: 'Mike Ross',
    userAvatar: 'https://picsum.photos/100/100?random=3',
    content: 'Does anyone have the notes for Cost Accounting 101? Willing to trade for Business Law notes!',
    likes: 12,
    comments: 8,
    timestamp: '4h ago'
  }
];

export const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  const handleLike = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="pb-20 md:pb-0">
      {/* Banner Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 md:rounded-xl shadow-lg mb-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
          <Zap size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center mb-2">
            <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mr-2 border border-white/20">Announcement</span>
            <span className="text-xs font-medium opacity-90">Today</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Accounting Exams Next Week!</h2>
          <p className="text-indigo-100 text-sm mb-4">Don't forget to complete your SkillGo modules to earn extra XP before the finals.</p>
          <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
            View Schedule
          </button>
        </div>
      </div>

      {/* Stories / Status Bar */}
      <div className="bg-white p-4 md:rounded-xl md:shadow-sm md:border md:border-gray-100 overflow-x-auto whitespace-nowrap mb-6 no-scrollbar">
        <div className="inline-block mr-4 text-center cursor-pointer">
           <div className="w-16 h-16 rounded-full border-2 border-dashed border-indigo-500 flex items-center justify-center mb-1 hover:bg-indigo-50 transition-colors">
             <PlusSquare className="text-indigo-500" />
           </div>
           <span className="text-xs text-gray-500 font-medium">Add Story</span>
        </div>
        {[1,2,3,4,5,6,7].map((i) => (
          <div key={i} className="inline-block mr-4 text-center cursor-pointer group">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-indigo-600 mb-1 group-hover:scale-105 transition-transform">
              <img src={`https://picsum.photos/100/100?random=${i + 10}`} className="w-full h-full rounded-full border-2 border-white object-cover" alt="story" />
            </div>
            <span className="text-xs text-gray-500 font-medium">Student {i}</span>
          </div>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white md:rounded-xl shadow-sm border-y md:border border-gray-100 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <img src={post.userAvatar} alt="" className="w-10 h-10 rounded-full mr-3 border border-gray-100" />
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">{post.userName}</h3>
                  <p className="text-xs text-gray-500">{post.timestamp}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:bg-gray-100 p-1 rounded-full"><MoreHorizontal size={20}/></button>
            </div>
            
            <div className="px-4 pb-3">
              <p className="text-gray-800 text-sm leading-relaxed">{post.content}</p>
            </div>
            
            {post.image && (
              <div className="w-full bg-gray-100">
                <img src={post.image} alt="post" className="w-full max-h-[500px] object-cover" />
              </div>
            )}
            
            <div className="p-4 border-t border-gray-50 flex items-center justify-between text-gray-500">
              <button onClick={() => handleLike(post.id)} className="flex items-center space-x-2 hover:text-red-500 transition-colors group">
                <Heart size={20} className="group-hover:fill-current" />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-indigo-600 transition-colors">
                <MessageCircle size={20} />
                <span className="text-sm font-medium">{post.comments}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-indigo-600 transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};