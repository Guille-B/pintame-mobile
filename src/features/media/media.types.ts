export type LocalPhoto = {
  uri: string;
  width: number;
  height: number;
  source: 'camera' | 'library' | 'custom-camera';
  mimeType?: string;
  fileName?: string;
  fileSize?: number;
};

export type OptimizedPhoto = {
  uri: string;
  width: number;
  height: number;
  sizeBytes: number | null;
};

export type OptimizationComparison = {
  beforeBytes: number | null;
  afterBytes: number | null;
  reductionPercent: number | null;
  optimizedPhoto: OptimizedPhoto;
};
