const db = require("../db");
const Joi = require("joi");

const albumSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

exports.createAlbum = async (req, res, next) => {
  try {
    const { error } = albumSchema.validate(req.body);
    if (error) throw { status: 400, message: error.message };
    const { name, year } = req.body;
    const id = `album-${Date.now()}`;
    await db.query("INSERT INTO albums (id, name, year) VALUES ($1, $2, $3)", [
      id,
      name,
      year,
    ]);
    res.status(201).json({ status: "success", data: { albumId: id } });
  } catch (e) {
    next(e);
  }
};

exports.getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const albumRes = await db.query("SELECT * FROM albums WHERE id = $1", [id]);
    if (albumRes.rowCount === 0)
      throw { status: 404, message: "Album not found" };
    
    // Get songs for this album (optional criteria 1)
    const songsRes = await db.query(
      "SELECT id, title, performer FROM songs WHERE album_id = $1",
      [id]
    );
    
    const album = {
      id: albumRes.rows[0].id,
      name: albumRes.rows[0].name,
      year: albumRes.rows[0].year
    };
    
    // Add songs to response if there are any (optional criteria 1)
    if (songsRes.rowCount > 0) {
      album.songs = songsRes.rows;
    }
    
    res.json({
      status: "success",
      data: { album },
    });
  } catch (e) {
    next(e);
  }
};

exports.updateAlbum = async (req, res, next) => {
  try {
    const { error } = albumSchema.validate(req.body);
    if (error) throw { status: 400, message: error.message };
    const { id } = req.params;
    const { name, year } = req.body;
    const result = await db.query(
      "UPDATE albums SET name=$1, year=$2 WHERE id=$3",
      [name, year, id]
    );
    if (result.rowCount === 0)
      throw { status: 404, message: "Album not found" };
    res.json({ status: "success", message: "Album updated successfully" });
  } catch (e) {
    next(e);
  }
};

exports.deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM albums WHERE id=$1", [id]);
    if (result.rowCount === 0)
      throw { status: 404, message: "Album not found" };
    res.json({ status: "success", message: "Album deleted successfully" });
  } catch (e) {
    next(e);
  }
};