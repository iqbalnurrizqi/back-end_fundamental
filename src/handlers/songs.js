const db = require("../db");
const Joi = require("joi");

const songSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().optional(),
  albumId: Joi.string().optional(),
});

exports.createSong = async (req, res, next) => {
  try {
    const { error } = songSchema.validate(req.body);
    if (error) throw { status: 400, message: error.message };
    const { title, year, performer, genre, duration, albumId } = req.body;
    const id = `song-${Date.now()}`;
    await db.query(
      "INSERT INTO songs (id, title, year, performer, genre, duration, album_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [id, title, year, performer, genre, duration, albumId]
    );
    res.status(201).json({ status: "success", data: { songId: id } });
  } catch (e) {
    next(e);
  }
};

exports.getSongs = async (req, res, next) => {
  try {
    const { title, performer } = req.query;
    let query = "SELECT id, title, performer FROM songs";
    const conditions = [];
    const values = [];
    
    // Implement query parameters for searching songs (optional criteria 2)
    if (title) {
      values.push(`%${title.toLowerCase()}%`);
      conditions.push(`LOWER(title) LIKE $${values.length}`);
    }
    if (performer) {
      values.push(`%${performer.toLowerCase()}%`);
      conditions.push(`LOWER(performer) LIKE $${values.length}`);
    }
    if (conditions.length > 0) query += ` WHERE ${conditions.join(" AND ")}`;
    
    const result = await db.query(query, values);
    res.json({ status: "success", data: { songs: result.rows } });
  } catch (e) {
    next(e);
  }
};

exports.getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM songs WHERE id = $1", [id]);
    if (result.rowCount === 0) throw { status: 404, message: "Song not found" };
    
    // Format the response according to the criteria
    const song = {
      id: result.rows[0].id,
      title: result.rows[0].title,
      year: result.rows[0].year,
      performer: result.rows[0].performer,
      genre: result.rows[0].genre,
      duration: result.rows[0].duration,
      albumId: result.rows[0].album_id
    };
    
    res.json({ status: "success", data: { song } });
  } catch (e) {
    next(e);
  }
};

exports.updateSong = async (req, res, next) => {
  try {
    const { error } = songSchema.validate(req.body);
    if (error) throw { status: 400, message: error.message };
    const { id } = req.params;
    const { title, year, performer, genre, duration, albumId } = req.body;
    const result = await db.query(
      "UPDATE songs SET title=$1, year=$2, performer=$3, genre=$4, duration=$5, album_id=$6 WHERE id=$7",
      [title, year, performer, genre, duration, albumId, id]
    );
    if (result.rowCount === 0) throw { status: 404, message: "Song not found" };
    res.json({ status: "success", message: "Song updated successfully" });
  } catch (e) {
    next(e);
  }
};

exports.deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM songs WHERE id = $1", [id]);
    if (result.rowCount === 0) throw { status: 404, message: "Song not found" };
    res.json({ status: "success", message: "Song deleted successfully" });
  } catch (e) {
    next(e);
  }
};