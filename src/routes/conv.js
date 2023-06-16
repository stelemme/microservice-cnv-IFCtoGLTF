const express = require("express");
const router = express.Router();

// Importing the controllers
const {
  colladaToGltfGET,
  colladaToGltfPOST,
} = require("../controllers/colladaToGltf");

// Assigning controllers to the "/op/IFCtoGLTF" URI
router.get("/collada-to-gltf", colladaToGltfGET);
router.post("/collada-to-gltf", colladaToGltfPOST);

module.exports = router;
