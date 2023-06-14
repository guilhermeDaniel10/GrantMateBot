import multer from "multer";

// configure storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/usr/app/file-storage");
  },
  filename: function (req, file, cb) {
    //const ext = file.originalname.split(".").pop();
    const pathWithoutSpaces = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${pathWithoutSpaces}`);
  },
});

export default storage;
