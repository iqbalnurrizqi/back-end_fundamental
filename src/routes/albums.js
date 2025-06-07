const express = require("express");
const router = express.Router();
const handler = require("../handlers/albums");

router.post("/", handler.createAlbum);
router.get("/:id", handler.getAlbumById);
router.put("/:id", handler.updateAlbum);
router.delete("/:id", handler.deleteAlbum);

module.exports = router;
