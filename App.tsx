import React, { useState, useEffect } from 'react';
import { User, ViewState } from './types';
import { Feed } from './components/Feed';
import { Chat } from './components/Chat';
import { Learn } from './components/Learn';
import { BizHub } from './components/BizHub';
import { Home, MessageSquare, BookOpen, ShoppingBag, User as UserIcon, LogOut, GraduationCap } from 'lucide-react';

const INITIAL_USER: User = {
  id: 'me',
  name: 'John Doe',
  avatar: 'https://picsum.photos/100/100?random=99',
  bio: 'Accounting Major | Class of 2025',
  collegeId: 'ACC2025-JD',
  points: 120,
  rank: 'Starter'
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.FEED);
  const [user, setUser] = useState<User>(INITIAL_USER);

  // Update Rank based on points
  useEffect(() => {
    let newRank: User['rank'] = 'Starter';
    if (user.points >= 3000) newRank = 'The Legend';
    else if (user.points >= 1500) newRank = 'Pro-Accountant';
    else if (user.points >= 500) newRank = 'Learner';

    if (newRank !== user.rank) {
      setUser(prev => ({ ...prev, rank: newRank }));
    }
  }, [user.points]);

  const handleUpdatePoints = (pts: number) => {
    setUser(prev => ({ ...prev, points: prev.points + pts }));
  };

  const NavItem = ({ target, icon: Icon, label }: { target: ViewState; icon: any; label: string }) => (
    <button 
      onClick={() => setView(target)}
      className={`flex items-center w-full p-3 rounded-xl transition-all mb-2 ${view === target ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
    >
      <Icon size={22} className={view === target ? 'fill-current' : ''} strokeWidth={view === target ? 2 : 1.5} />
      <span className="ml-3 font-medium">{label}</span>
    </button>
  );

  const MobileNavButton = ({ target, icon: Icon, label }: { target: ViewState; icon: any; label: string }) => (
    <button 
      onClick={() => setView(target)}
      className={`flex flex-col items-center justify-center w-full py-3 ${view === target ? 'text-indigo-600' : 'text-gray-400'}`}
    >
      <Icon size={24} className={view === target ? 'fill-current' : ''} strokeWidth={view === target ? 2 : 1.5} />
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-900 font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r h-screen sticky top-0 z-20">
        <div className="p-6 flex items-center border-b border-gray-100">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
             <GraduationCap className="text-white w-5 h-5" />
           </div>
           <span className="text-xl font-bold text-gray-800 tracking-tight">HemoGo</span>
        </div>
        
        <nav className="flex-1 px-4 py-6">
          <NavItem target={ViewState.FEED} icon={Home} label="HemoFeed" />
          <NavItem target={ViewState.CHAT} icon={MessageSquare} label="Messages" />
          <NavItem target={ViewState.LEARN} icon={BookOpen} label="SkillGo" />
          <NavItem target={ViewState.BIZ} icon={ShoppingBag} label="BizHub" />
          <NavItem target={ViewState.PROFILE} icon={UserIcon} label="Profile" />
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center">
            <img src={user.avatar} className="w-10 h-10 rounded-full mr-3 border-2 border-white shadow-sm" alt="User" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-indigo-600 truncate">{user.rank}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-screen overflow-y-auto relative no-scrollbar">
         {/* Top Header (Desktop Only) - Optional for search/notifications, keeping clean for now */}
         
         <div className={`mx-auto ${view === ViewState.CHAT ? 'h-full max-w-full p-0 md:p-6' : 'w-full px-0 md:px-8 pb-24 md:pb-8'}`}>
            {view === ViewState.FEED && (
              <div className="max-w-4xl mx-auto mt-0 md:mt-4">
                <Feed />
              </div>
            )}
            
            {view === ViewState.CHAT && <Chat />}
            
            {view === ViewState.LEARN && <div className="max-w-6xl mx-auto"><Learn user={user} onUpdatePoints={handleUpdatePoints} /></div>}
            
            {view === ViewState.BIZ && <div className="max-w-6xl mx-auto"><BizHub onContact={() => setView(ViewState.CHAT)} /></div>}
            
            {view === ViewState.PROFILE && (
              <div className="p-8 flex flex-col items-center pt-20 max-w-lg mx-auto bg-white md:rounded-2xl md:shadow-sm md:mt-10">
                <img src={user.avatar} className="w-32 h-32 rounded-full mb-4 ring-4 ring-indigo-100 shadow-xl" />
                <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-indigo-600 font-medium mb-1 text-lg">{user.collegeId}</p>
                <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold uppercase tracking-wide mb-8">{user.rank}</span>
                <p className="text-center text-gray-500 mb-8 px-4 leading-relaxed">{user.bio}</p>
                <div className="grid grid-cols-2 gap-6 w-full text-center">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                     <div className="text-3xl font-bold text-indigo-600">{user.points}</div>
                     <div className="text-xs text-gray-500 uppercase font-semibold mt-1">Total Points</div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                     <div className="text-3xl font-bold text-indigo-600">12</div>
                     <div className="text-xs text-gray-500 uppercase font-semibold mt-1">Modules Done</div>
                  </div>
                </div>
              </div>
            )}
         </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center z-50 safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <MobileNavButton target={ViewState.FEED} icon={Home} label="Feed" />
        <MobileNavButton target={ViewState.CHAT} icon={MessageSquare} label="Chat" />
        <div className="relative -top-5">
           <button 
             onClick={() => setView(ViewState.LEARN)}
             className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform transition-transform border-4 border-gray-50 ${view === ViewState.LEARN ? 'bg-indigo-700 scale-110' : 'bg-indigo-600'}`}
           >
             <BookOpen className="text-white" size={24} />
           </button>
        </div>
        <MobileNavButton target={ViewState.BIZ} icon={ShoppingBag} label="BizHub" />
        <MobileNavButton target={ViewState.PROFILE} icon={UserIcon} label="Profile" />
      </nav>
    </div>
  );
};

export default App;