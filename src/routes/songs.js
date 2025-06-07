const express = require("express");
const router = express.Router();
const handler = require("../handlers/songs");

router.post("/", handler.createSong);
router.get("/", handler.getSongs);
router.get("/:id", handler.getSongById);
router.put("/:id", handler.updateSong);
router.delete("/:id", handler.deleteSong);

module.exports = router;