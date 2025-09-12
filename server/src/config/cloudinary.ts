import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

interface UploadedFile {
  tempFilePath: string;
}

interface UploadResult {
  id: string;
  url: string;
}

const uploadSingleFile = async (
  file: UploadedFile,
  dirname: string
): Promise<UploadResult> => {
  const fileDirname = `${process.env.CLOUDINARY_DIR_NAME}/${dirname}`;
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: fileDirname || "uploads",
    resource_type: "auto",
  });

  return {
    id: result.public_id,
    url: result.secure_url,
  };
};

const uploadMultipleFile = async (
  files: UploadedFile[],
  dirname: string
): Promise<UploadResult[]> => {
  const imageArray: UploadResult[] = [];

  for (let index = 0; index < files.length; index++) {
    const result = await uploadSingleFile(files[index], dirname);
    imageArray.push(result);
  }

  return imageArray;
};

// const RemoveFile = async () => {};

export { uploadSingleFile, uploadMultipleFile };
