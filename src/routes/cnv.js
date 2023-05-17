const express = require("express");
const router = express.Router();
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, next) {
      next(null, 'base-files');
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.ifc');
  }
})

const upload = multer({
  storage: storage
});

// Importing the controllers
const {
  descriptionGET,
  IfcToGltfGET,
  IfcToGltfPOST,
} = require("../controllers/ifcToGltf");

// Assigning a controller to the "/cnv/" URI
router.get("/", descriptionGET);

// Assigning controllers to the "/op/IFCtoGLTF" URI
router.get("/IFCtoGLTF", IfcToGltfGET);
router.post("/IFCtoGLTF", upload.single('ifcFile'), IfcToGltfPOST);

module.exports = router;
