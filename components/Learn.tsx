import React, { useState } from 'react';
import { User, QuizQuestion, TutorialCategory } from '../types';
import { generateAccountingQuiz } from '../services/geminiService';
import { 
  Trophy, BookOpen, BrainCircuit, CheckCircle, XCircle, Loader2, 
  Palette, PenTool, Video, Clapperboard, ChevronLeft, PlayCircle 
} from 'lucide-react';

// --- MOCK DATA FOR CREATIVE TUTORIALS ---
const CREATIVE_COURSES: TutorialCategory[] = [
  {
    id: 'ps',
    name: 'Adobe Photoshop',
    description: 'Basic to Advanced Bengali Tutorials',
    icon: 'palette',
    tutorials: [
      { id: '1', title: 'Part 1: Interface Introduction (Bangla)', duration: '12:30', thumbnail: 'https://picsum.photos/300/180?random=101', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: '2', title: 'Part 2: Layers & Selection Tools', duration: '15:45', thumbnail: 'https://picsum.photos/300/180?random=102', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: '3', title: 'Part 3: Photo Retouching Basics', duration: '18:20', thumbnail: 'https://picsum.photos/300/180?random=103', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ]
  },
  {
    id: 'ai',
    name: 'Adobe Illustrator',
    description: 'Vector Art & Logo Design',
    icon: 'pentool',
    tutorials: [
      { id: '1', title: 'Class 1: Getting Started with AI', duration: '10:15', thumbnail: 'https://picsum.photos/300/180?random=104', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: '2', title: 'Class 2: Pen Tool Mastery', duration: '20:00', thumbnail: 'https://picsum.photos/300/180?random=105', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ]
  },
  {
    id: 'ae',
    name: 'Adobe After Effects',
    description: 'Motion Graphics & VFX',
    icon: 'clapperboard',
    tutorials: [
      { id: '1', title: 'Intro to Motion Graphics', duration: '14:20', thumbnail: 'https://picsum.photos/300/180?random=106', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: '2', title: 'Keyframes Animation Basic', duration: '16:50', thumbnail: 'https://picsum.photos/300/180?random=107', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ]
  },
  {
    id: 'pr',
    name: 'Adobe Premiere Pro',
    description: 'Professional Video Editing',
    icon: 'video',
    tutorials: [
      { id: '1', title: 'Video Editing 101 (Bangla)', duration: '25:00', thumbnail: 'https://picsum.photos/300/180?random=108', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: '2', title: 'Color Grading Basics', duration: '12:10', thumbnail: 'https://picsum.photos/300/180?random=109', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ]
  }
];

interface LearnProps {
  user: User;
  onUpdatePoints: (points: number) => void;
}

type Mode = 'HUB' | 'ACCOUNTING' | 'CREATIVE_LIST' | 'CREATIVE_PLAYER';

export const Learn: React.FC<LearnProps> = ({ user, onUpdatePoints }) => {
  const [mode, setMode] = useState<Mode>('HUB');
  
  // Accounting State
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [quizData, setQuizData] = useState<{ lessonContent: string, questions: QuizQuestion[] } | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);

  // Creative State
  const [selectedCategory, setSelectedCategory] = useState<TutorialCategory | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // --- ACCOUNTING LOGIC ---
  const startLesson = async () => {
    if (!topic) return;
    setLoading(true);
    const data = await generateAccountingQuiz(topic);
    setQuizData(data);
    setCurrentQuestionIndex(0);
    setLessonComplete(false);
    setIsAnswered(false);
    setSelectedOption(null);
    setLoading(false);
  };

  const handleAnswer = (index: number) => {
    if (isAnswered || !quizData) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === quizData.questions[currentQuestionIndex].correctAnswer) {
      onUpdatePoints(10); 
    }
  };

  const nextQuestion = () => {
    if (!quizData) return;
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setLessonComplete(true);
      onUpdatePoints(50);
    }
  };

  // --- RENDERS ---

  const renderHeader = () => (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
      <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform origin-bottom-left"></div>
      <div className="flex justify-between items-center mb-4 relative z-10">
        <div>
          <h2 className="text-3xl font-bold">{user.points} XP</h2>
          <p className={`text-sm font-semibold opacity-90 uppercase tracking-wider`}>{user.rank}</p>
        </div>
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner">
          <Trophy className="w-8 h-8 text-yellow-300" />
        </div>
      </div>
      <div className="w-full bg-black/20 rounded-full h-3 relative z-10">
        <div className="bg-yellow-400 h-3 rounded-full transition-all duration-1000" style={{ width: `${(user.points % 1000) / 10}%` }}></div>
      </div>
      <p className="text-xs mt-2 opacity-75 relative z-10">Next rank in {1500 - user.points > 0 ? 1500 - user.points : 0} XP</p>
    </div>
  );

  // 1. MAIN HUB VIEW
  if (mode === 'HUB') {
    return (
      <div className="pb-24 p-4 md:p-0 min-h-screen">
        {renderHeader()}
        <h3 className="font-bold text-gray-800 text-xl mb-6">SkillGo Hub</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Accounting Card */}
          <div 
            onClick={() => setMode('ACCOUNTING')}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="p-4 bg-indigo-100 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                <BrainCircuit className="text-indigo-600" size={32} />
              </div>
              <div>
                <h4 className="font-bold text-xl text-gray-800 group-hover:text-indigo-600 transition-colors">Accounting Master</h4>
                <p className="text-sm text-gray-500 font-medium bg-indigo-50 inline-block px-2 py-0.5 rounded mt-1">Exam Prep (Bengali)</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">Prepare for exams with instant AI-generated lessons and quizzes in <strong>Bengali</strong>.</p>
          </div>

          {/* Creative Card */}
          <div 
            onClick={() => setMode('CREATIVE_LIST')}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="p-4 bg-pink-100 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                <Palette className="text-pink-600" size={32} />
              </div>
              <div>
                <h4 className="font-bold text-xl text-gray-800 group-hover:text-pink-600 transition-colors">Creative Tutorials</h4>
                <p className="text-sm text-gray-500 font-medium bg-pink-50 inline-block px-2 py-0.5 rounded mt-1">Adobe Suite (Bangla)</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">Free video resources for Photoshop, Illustrator, After Effects, and Premiere Pro.</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. ACCOUNTING VIEW (Existing Logic)
  if (mode === 'ACCOUNTING') {
    return (
      <div className="pb-24 p-4 md:p-0 min-h-screen">
        <button onClick={() => setMode('HUB')} className="flex items-center text-gray-500 mb-6 hover:text-indigo-600 transition-colors">
          <ChevronLeft size={20} /> <span className="text-sm font-medium ml-1">Back to Hub</span>
        </button>
        
        {renderHeader()}

        {!quizData ? (
          <div className="space-y-6 max-w-2xl mx-auto">
             <div className="text-center mb-8">
               <h3 className="font-bold text-indigo-900 text-2xl flex items-center justify-center">
                 Accounting Master
               </h3>
               <p className="text-gray-500 mt-2">Generate Accounting lessons & quizzes in Bengali</p>
             </div>
             
             <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-indigo-50">
               <label className="block text-sm font-bold text-gray-700 mb-2">Enter Syllabus Topic (English or Bangla):</label>
               <input 
                 type="text" 
                 className="w-full border-gray-200 bg-gray-50 rounded-xl p-4 text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none mb-6 border transition-all"
                 placeholder="e.g. জাবেদা, খতিয়ান, Balance Sheet, Cost Accounting"
                 value={topic}
                 onChange={(e) => setTopic(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && startLesson()}
               />
               <button 
                onClick={startLesson} 
                disabled={loading || !topic}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:shadow-none"
               >
                 {loading ? <Loader2 className="animate-spin mr-2" /> : <BookOpen className="mr-2" />}
                 Start Revision (Bengali)
               </button>
             </div>
             
             {/* Suggested Topics */}
             <div>
               <h3 className="font-bold text-gray-400 mb-3 text-xs uppercase tracking-wider text-center">Popular Exam Topics</h3>
               <div className="flex flex-wrap justify-center gap-3">
                 {['Bank Reconciliation', 'Depreciation', 'Trial Balance', 'Cash Flow', 'Ledger'].map(t => (
                   <button key={t} onClick={() => setTopic(t)} className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
                     {t}
                   </button>
                 ))}
               </div>
             </div>
          </div>
        ) : lessonComplete ? (
          <div className="bg-white rounded-2xl p-10 shadow-lg text-center flex flex-col items-center max-w-lg mx-auto mt-10">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <Trophy className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Lesson Complete!</h2>
            <p className="text-gray-500 mb-8 text-lg">You earned +50 XP and reviewed {topic}.</p>
            <button onClick={() => setQuizData(null)} className="bg-indigo-600 text-white px-10 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all">
              Next Topic
            </button>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {currentQuestionIndex === 0 && !isAnswered && (
               <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><BookOpen size={150} /></div>
                  <h3 className="font-bold text-indigo-900 mb-4 text-xl relative z-10 flex items-center"><BrainCircuit className="mr-2"/> Quick Revision Note</h3>
                  <p className="text-gray-800 leading-relaxed text-base relative z-10 font-bengali">{quizData.lessonContent}</p>
               </div>
            )}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Question {currentQuestionIndex + 1}/{quizData.questions.length}</span>
                 <div className="flex space-x-1">
                   {quizData.questions.map((_, i) => (
                     <div key={i} className={`w-2 h-2 rounded-full ${i <= currentQuestionIndex ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                   ))}
                 </div>
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 font-bengali">{quizData.questions[currentQuestionIndex].question}</h3>
                <div className="space-y-4">
                  {quizData.questions[currentQuestionIndex].options.map((option, idx) => {
                    let btnClass = "w-full text-left p-5 rounded-xl border-2 transition-all font-medium text-base font-bengali ";
                    if (isAnswered) {
                      if (idx === quizData.questions[currentQuestionIndex].correctAnswer) btnClass += "border-green-500 bg-green-50 text-green-700";
                      else if (idx === selectedOption) btnClass += "border-red-500 bg-red-50 text-red-700";
                      else btnClass += "border-gray-100 text-gray-400 opacity-50";
                    } else {
                      btnClass += "border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700 hover:shadow-md";
                    }
                    return (
                      <button key={idx} onClick={() => handleAnswer(idx)} disabled={isAnswered} className={btnClass}>
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {isAnswered && idx === quizData.questions[currentQuestionIndex].correctAnswer && <CheckCircle size={24} className="text-green-500" />}
                          {isAnswered && idx === selectedOption && idx !== quizData.questions[currentQuestionIndex].correctAnswer && <XCircle size={24} className="text-red-500" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {isAnswered && (
                  <div className="mt-8 animate-fade-in">
                    <div className="bg-blue-50 p-5 rounded-xl text-blue-800 text-sm mb-6 border border-blue-100 font-bengali">
                      <strong>Explanation:</strong> {quizData.questions[currentQuestionIndex].explanation}
                    </div>
                    <button onClick={nextQuestion} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors">
                      {currentQuestionIndex === quizData.questions.length - 1 ? 'Finish Module' : 'Next Question'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. CREATIVE MENU VIEW
  if (mode === 'CREATIVE_LIST') {
    return (
      <div className="pb-24 p-4 md:p-0 min-h-screen">
        <button onClick={() => setMode('HUB')} className="flex items-center text-gray-500 mb-6 hover:text-pink-600 transition-colors">
          <ChevronLeft size={20} /> <span className="text-sm font-medium ml-1">Back to Hub</span>
        </button>
        <h3 className="font-bold text-gray-800 text-2xl mb-6">Select Software</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {CREATIVE_COURSES.map(course => {
            // Icon mapping
            let Icon = Palette;
            if (course.icon === 'pentool') Icon = PenTool;
            if (course.icon === 'video') Icon = Video;
            if (course.icon === 'clapperboard') Icon = Clapperboard;

            return (
              <button 
                key={course.id}
                onClick={() => { setSelectedCategory(course); setMode('CREATIVE_PLAYER'); setActiveVideo(null); }}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 flex flex-col items-center text-center h-48 justify-center group transition-all hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-4 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                  <Icon size={32} />
                </div>
                <span className="font-bold text-gray-800 text-base mb-1">{course.name}</span>
                <span className="text-xs text-gray-400">{course.tutorials.length} Tutorials</span>
              </button>
            )
          })}
        </div>
        
        <div className="mt-8 bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center">
           <p className="text-sm text-yellow-800">
             ⚠️ Note: These are curated Bengali tutorials sourced from free YouTube educational channels.
           </p>
        </div>
      </div>
    );
  }

  // 4. CREATIVE PLAYER VIEW
  if (mode === 'CREATIVE_PLAYER' && selectedCategory) {
    return (
      <div className="pb-24 p-4 md:p-0 min-h-screen">
        <button onClick={() => setMode('CREATIVE_LIST')} className="flex items-center text-gray-500 mb-6 hover:text-pink-600 transition-colors">
          <ChevronLeft size={20} /> <span className="text-sm font-medium ml-1">Back to Software</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left: Player */}
           <div className="lg:col-span-2">
              {activeVideo ? (
                 <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-6 aspect-video">
                   <iframe 
                     width="100%" 
                     height="100%" 
                     src={activeVideo} 
                     title="Video player" 
                     frameBorder="0" 
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                     allowFullScreen
                   ></iframe>
                 </div>
              ) : (
                <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl mb-6 aspect-video flex items-center justify-center text-white border-b-4 border-pink-500">
                   <div className="text-center">
                     <PlayCircle size={64} className="mx-auto mb-4 opacity-50 animate-pulse" />
                     <p className="text-lg font-medium">Select a tutorial from the list to start watching</p>
                   </div>
                </div>
              )}
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="font-bold text-gray-800 text-2xl mb-2">{selectedCategory.name}</h3>
                 <p className="text-gray-500">{selectedCategory.description}</p>
              </div>
           </div>

           {/* Right: List */}
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                 <h4 className="font-bold text-gray-700">Course Content</h4>
              </div>
              <div className="p-2 space-y-2">
                {selectedCategory.tutorials.map((tut) => (
                  <div 
                    key={tut.id} 
                    onClick={() => setActiveVideo(tut.videoUrl)}
                    className={`flex items-start p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-all ${activeVideo === tut.videoUrl ? 'bg-pink-50 ring-1 ring-pink-500' : ''}`}
                  >
                    <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden mr-3 relative flex-shrink-0">
                      <img src={tut.thumbnail} className="w-full h-full object-cover" alt="thumb" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10">
                        <PlayCircle size={20} className="text-white drop-shadow-md" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-sm line-clamp-2 leading-tight mb-1 ${activeVideo === tut.videoUrl ? 'text-pink-700' : 'text-gray-800'}`}>{tut.title}</h4>
                      <span className="text-xs text-gray-500 block">{tut.duration} • Bengali</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return null;
};