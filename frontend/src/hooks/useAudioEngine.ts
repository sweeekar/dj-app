import { useCallback, useEffect, useRef, useState } from 'react';

export const useAudioEngine = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const context = new AudioContext();
    const source = context.createMediaElementSource(audio);
    const analyserNode = context.createAnalyser();
    analyserNode.fftSize = 2048;

    source.connect(analyserNode);
    analyserNode.connect(context.destination);

    contextRef.current = context;
    setAnalyser(analyserNode);

    return () => {
      audio.pause();
      context.close();
    };
  }, []);

  const loadAndPlay = useCallback(async (url: string, playbackRate = 1) => {
    if (!audioRef.current) return;

    if (contextRef.current?.state === 'suspended') {
      await contextRef.current.resume();
    }

    audioRef.current.src = url;
    audioRef.current.playbackRate = playbackRate;
    await audioRef.current.play();
  }, []);

  return {
    analyser,
    loadAndPlay
  };
};
