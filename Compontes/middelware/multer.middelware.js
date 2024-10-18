const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/uploads/'); 
  },
  filename: function (req, file, cb) {
    
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); 
  }
});

// File filter for image uploads
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|.jpg|.png|.jpeg/; 
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg, and .jpeg format allowed!"));
  }

};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = {
  uploadSingleFile: upload.single('avatar') 
};