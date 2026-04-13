import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { uploadSong } from '../services/api';

interface UploadProps {
  onUploaded: () => Promise<void>;
}

export const Upload = ({ onUploaded }: UploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    setError('');
    try {
      await uploadSong(file);
      await onUploaded();
      event.target.value = '';
    } catch (uploadError) {
      setError((uploadError as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="panel">
      <h2>Upload tracks</h2>
      <input aria-label="Upload song" type="file" accept="audio/*" onChange={onFileChange} disabled={isUploading} />
      {isUploading && <p>Analyzing BPM and loop points...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};
