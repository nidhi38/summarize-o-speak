
export type Language = {
  code: string;
  name: string;
  flag?: string;
};

export type FileStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

export type DocumentFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  progress?: number;
  url?: string;
  summary?: string;
  uploadDate: Date;
  language?: string;
};

export type AudioConversion = {
  id: string;
  text: string;
  audioUrl?: string;
  isGenerating: boolean;
  language: string;
  createdAt: Date;
};
