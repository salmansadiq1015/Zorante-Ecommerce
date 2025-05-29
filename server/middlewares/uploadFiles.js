// import multer from "multer";
// import path from "path";
// import util from "util";
// import { S3Client } from "@aws-sdk/client-s3";
// import multerS3 from "multer-s3";

// import dotenv from "dotenv";
// dotenv.config();

// export const s3 = new S3Client({
//   credentials: {
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   },
//   region: "eu-north-1",
//   forcePathStyle: true,
// });

// const storage = multerS3({
//   s3: s3,
//   bucket: process.env.AWS_S3_BUCKET_NAME,
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   metadata: function (req, file, cb) {
//     cb(null, { fieldName: file.fieldname });
//   },
//   key: (req, file, cb) => {
//     const uniqueName = `${Date.now()}_${file.originalname.replace(
//       /\s+/g,
//       "_"
//     )}`;
//     cb(null, uniqueName);
//   },
// });

// function checkFileType(file, cb) {
//   const fileTypes =
//     /jpg|jpeg|png|webp|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|mp3|wav|ogg|aac|flac|m4a|wma|alac|aiff|opus|mp4|mov|mpeg-4|avi|wmv|flv|mkv|webm|zip/;

//   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

//   const mimeType = fileTypes.test(file.mimetype);

//   if (extname && mimeType) {
//     return cb(null, true);
//   } else {
//     cb(
//       new Error(
//         "Error: Supported file types are jpeg, gif, png,webp, mp3, mp4, pptx, pdf, jpg, xls, doc, docx, xlsx, txt, csv, mov, mpeg-4."
//       )
//     );
//   }
// }

// const upload = multer({
//   limits: {
//     fileSize: 20 * 1024 * 1024,
//   },
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// }).array("file", 5);

// const uploadMiddleware = util.promisify(upload);

// export default uploadMiddleware;

// ----------------------------------------------------------->
import multer from "multer";
import path from "path";
import util from "util";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import sharp from "sharp";
import stream from "stream";
import dotenv from "dotenv";

dotenv.config();

export const s3 = new S3Client({
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  },
  region: "eu-north-1",
  forcePathStyle: true,
  requestHandler: {
    metadata: {
      keepAlive: true,
      timeout: 300000,
    },
  },
});

const compressImage = async (fileBuffer) => {
  return sharp(fileBuffer)
    .resize(600, 600, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 50, progressive: true })
    .toBuffer();
};

const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname.replace(
      /\s+/g,
      "_"
    )}`;
    cb(null, uniqueName);
  },
  shouldTransform: async (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  transformFile: async (req, file, cb) => {
    try {
      const compressedBuffer = await compressImage(file.buffer);
      const compressedStream = new stream.PassThrough();
      compressedStream.end(compressedBuffer);
      cb(null, compressedStream);
    } catch (error) {
      cb(error);
    }
  },
});

function checkFileType(file, cb) {
  const fileTypes =
    /jpg|jpeg|png|webp|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|mp3|wav|ogg|aac|flac|m4a|wma|alac|aiff|opus|mp4|mov|mpeg-4|avi|wmv|flv|mkv|webm|zip/;

  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extname && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Error: Unsupported file type."));
  }
}

const upload = multer({
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).array("file", 5);

const uploadMiddleware = util.promisify(upload);

export default uploadMiddleware;
