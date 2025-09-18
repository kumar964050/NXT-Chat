export interface BaseResponse {
  status: 'success' | 'fail' | 'error';
  message: string;
}

export interface UploadedFile {
  name: string;
  data: Buffer;
  size: number;
  encoding: string;
  tempFilePath: string;
  truncated: boolean;
  mimetype: string;
  md5: string;
  mv: (savePath: string, callback: (err: Error | null) => void) => void;
}
