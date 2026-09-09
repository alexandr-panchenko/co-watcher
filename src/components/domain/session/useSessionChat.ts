import { useState } from 'react';
import { ChatMessage, TimelineAnchor } from '../../../types';

interface UseSessionChatParams {
  videoId: string;
  currentTimeSec: number;
  formatTime: (sec: number) => string;
  setAnchors: React.Dispatch<React.SetStateAction<TimelineAnchor[]>>;
  changeVideo: (id: string) => void;
  fetchLectureMoments: (
    url: string
  ) => Promise<{ momentsCount: number; newComments: TimelineAnchor[] } | null>;
  sendChatApi: (text: string, videoId: string) => Promise<string | null>;
}

export function useSessionChat({
  videoId,
  currentTimeSec,
  formatTime,
  setAnchors,
  changeVideo,
  fetchLectureMoments,
  sendChatApi,
}: UseSessionChatParams) {
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const handleSendMessage = async (text: string) => {
    const timeFormatted = formatTime(currentTimeSec);
    const userMsg: ChatMessage = {
      id: `msg-user-${currentTimeSec}`,
      sender: 'user',
      timestamp: timeFormatted,
      text,
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    const apiReply = await sendChatApi(text, videoId);
    const replyText =
      apiReply ||
      `Understood. I will track "${text}" relative to the current lecture timestamp (${formatTime(
        currentTimeSec
      )}).`;

    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-asst-${currentTimeSec}`,
        sender: 'assistant',
        timestamp: timeFormatted,
        text: replyText,
      },
    ]);
    setIsChatLoading(false);
  };

  const handleLoadYouTubeUrl = async (url: string) => {
    let newId = 'bCz4OMemCcA';
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
      newId = match[1];
    }

    changeVideo(newId);
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-user-load-${newId}`,
        sender: 'user',
        timestamp: '00:00',
        text: `Loaded video: ${url}`,
      },
      {
        id: `msg-asst-load-${newId}`,
        sender: 'assistant',
        timestamp: '00:00',
        text: `Analyzing new video with Gemini & Parallel Search...`,
      },
    ]);

    setIsChatLoading(true);
    const data = await fetchLectureMoments(url);
    if (data && data.newComments.length > 0) {
      setAnchors((prev) => [...prev, ...data.newComments].sort((a, b) => a.timeSec - b.timeSec));
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-asst-research-${newId}`,
          sender: 'assistant',
          timestamp: '00:00',
          text: `Extracted ${data.momentsCount} verified moments with citations on the rail!`,
        },
      ]);
    }
    setIsChatLoading(false);
  };

  return {
    isChatLoading,
    setIsChatLoading,
    chatMessages,
    setChatMessages,
    handleSendMessage,
    handleLoadYouTubeUrl,
  };
}
