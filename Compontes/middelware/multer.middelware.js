const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/uploads'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));  
  }
});

  const fileFilter = (req, file, cb) => {
  const filetypes = /pdf|jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); 

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDFs and image files (jpeg, jpg, png , pdf) are allowed."));  
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = {
  uploadSingleFile: upload.single('userimage'),  
  uploadPDFFile: upload.single('pdf_file'),
  uploadInvoice: upload.single('invoice'),
  
};
