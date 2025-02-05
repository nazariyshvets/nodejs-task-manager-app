import multer from "multer";

const upload = multer({
  limits: {
    fileSize: 1_000_000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("Please provide an image with jpg, jpeg or png extension"));
    }

    cb(undefined, true);
  },
});

export default upload;
