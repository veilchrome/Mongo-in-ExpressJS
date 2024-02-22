const express = require("express");
const axios = require("axios");
const Anime = require("../Models/animeModel");
const { isValidObjectId } = require("mongoose");

const getAnimeByTitle = async (req, res) => {
  try {
    // Add Validation to Check wherever data is exist or not in Database
    const anime = await Anime.findOne({ title: req.query.q });
    if (anime && anime.title === req.query.q) {
      res.json({
        message: "Success: Anime found in the database",
        data: anime,
      });
    } else {
      const response = await axios.get("https://api.jikan.moe/v4/anime", {
        params: { q: req.query.q },
      });
      const animeData = response.data.data;
      // console.log(animeData); check if the data are inputted or not

      const savedAnime = await Anime.create(animeData); // assuming animeData is an array
      // console.log(savedAnime);
      res.json({
        message: "Success: Anime retrieved from Jikan API and saved",
        data: savedAnime,
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteAnimeById = async (req, res) => {
  console.log(req.params.mal_id);
  try {
    if (!req.params.mal_id) {
      return res.status(400).json({ message: "Missing 'id' parameter" });
    }

    if (!isValidObjectId(req.params.mal_id)) {
      return res.status(400).json({ message: "Invalid 'id' parameter" });
    }

    const anime = await Anime.findById(req.params.mal_id);
    if (!anime) {
      return res.status(404).json({ message: "Anime not found" });
    }

    await anime.remove();
    return res.json({ message: "Success: Anime deleted successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getAnimeByTitle,
  deleteAnimeById,
};
