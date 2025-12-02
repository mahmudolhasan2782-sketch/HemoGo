import React, { useEffect, useRef, useState } from 'react';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  participantName: string;
}

export const VideoCallModal: React.FC<VideoCallProps> = ({ isOpen, onClose, participantName }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [status, setStatus] = useState("Connecting via P2P...");

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isOpen) {
      const startVideo = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          setTimeout(() => setStatus("Connected"), 1500);
        } catch (err) {
          console.error("Error accessing media devices:", err);
          setStatus("Camera access denied");
        }
      };
      startVideo();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center">
      <div className="relative w-full h-full max-w-md bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="absolute top-4 left-0 right-0 z-10 flex justify-between px-4 text-white">
          <div className="flex flex-col">
            <span className="font-bold text-lg">{participantName}</span>
            <span className="text-sm text-green-400">{status}</span>
          </div>
          <button onClick={onClose}><X className="w-8 h-8" /></button>
        </div>

        {/* Remote Video (Placeholder for P2P stream) */}
        <div className="flex-1 bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gray-700 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">
              {participantName[0]}
            </div>
            <p className="text-gray-400">Remote Stream</p>
          </div>
        </div>

        {/* Local Video (PiP) */}
        <div className="absolute top-20 right-4 w-32 h-48 bg-black rounded-lg overflow-hidden border-2 border-white shadow-lg">
           <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
           {!isCamOn && <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white text-xs">Camera Off</div>}
        </div>

        {/* Controls */}
        <div className="bg-gray-900 p-8 pb-12 flex justify-around items-center rounded-t-3xl">
          <button 
            onClick={() => setIsMicOn(!isMicOn)} 
            className={`p-4 rounded-full ${isMicOn ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
          >
            {isMicOn ? <Mic /> : <MicOff />}
          </button>
          
          <button 
            onClick={onClose}
            className="p-5 rounded-full bg-red-600 text-white shadow-lg transform active:scale-95 transition-transform"
          >
            <PhoneOff size={32} />
          </button>

          <button 
            onClick={() => setIsCamOn(!isCamOn)} 
            className={`p-4 rounded-full ${isCamOn ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
          >
            {isCamOn ? <Video /> : <VideoOff />}
          </button>
        </div>
      </div>
    </div>
  );
};