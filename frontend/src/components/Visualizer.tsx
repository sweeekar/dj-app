import { useEffect, useRef } from 'react';

interface VisualizerProps {
  analyser: AnalyserNode | null;
}

export const Visualizer = ({ analyser }: VisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    const waveformData = new Uint8Array(analyser.fftSize);
    let animation = 0;

    const draw = () => {
      analyser.getByteFrequencyData(frequencyData);
      analyser.getByteTimeDomainData(waveformData);

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#0f172a';
      context.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / frequencyData.length;
      for (let i = 0; i < frequencyData.length; i += 4) {
        const value = frequencyData[i] / 255;
        const barHeight = value * (canvas.height * 0.55);
        context.fillStyle = `hsl(${200 + value * 120}, 80%, 60%)`;
        context.fillRect(i * barWidth, canvas.height - barHeight, barWidth * 3, barHeight);
      }

      context.strokeStyle = '#38bdf8';
      context.lineWidth = 2;
      context.beginPath();
      for (let i = 0; i < waveformData.length; i++) {
        const x = (i / waveformData.length) * canvas.width;
        const y = (waveformData[i] / 255) * (canvas.height * 0.45);
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();

      animation = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animation);
  }, [analyser]);

  return (
    <div className="panel">
      <h2>Real-time visualizer</h2>
      <canvas ref={canvasRef} width={900} height={280} />
    </div>
  );
};
