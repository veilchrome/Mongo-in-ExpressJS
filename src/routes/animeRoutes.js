const router = require("express").Router();
const controllerAnime = require("../Controllers/animeController");

// READ Endpoint
router.get("/", controllerAnime.getAnimeByTitle);

// DELETE Endpoint
router.delete("/:mal_id", controllerAnime.deleteAnimeById);

module.exports = router;
