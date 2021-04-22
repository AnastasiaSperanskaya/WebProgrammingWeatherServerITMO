const asyncHandler = require('express-async-handler')
const router = require('express').Router();
const ApiHandler = require('./apiHandler');
const DAO = require('./dao');

const apiHandler = new ApiHandler();
const dao = new DAO();

router.get('/weather/city', asyncHandler(async (request, result) => {
  if (!request.query.q) {
    result.status(404).json();
    return;
  }
  const apiResponse = await apiHandler.getWeatherInfo(request.query.q);
  result.json(apiResponse);
}));

router.get('/weather/coordinates', asyncHandler(async (request, result) => {
  const regexp = /^-?\d+\.?\d+$/;
  if (!regexp.test(request.query.lat) || !regexp.test(request.query.lon)) {
    result.status(404).json();
    return;
  }
  const query = `${request.query.lat},${request.query.lon}`;
  const apiResponse = await apiHandler.getWeatherInfo(query);
  result.json(apiResponse);
}));

router.get('/favorites', asyncHandler( async (request, result) => {
  const favorites = await dao.getAll();
  const favoritesWeather = await apiHandler.getCities(favorites);
  result.json({ favorites: favoritesWeather });
}));

router.post('/favorites', asyncHandler(async (request, result) => {
  if (!request.query.city){
    result.status(404).send();
    return;
  }
  const data = await apiHandler.getWeatherInfo(request.query.city);
  const city = await dao.insert(data.city, data.coords);
  result.status(201).json({ name: city });
}));

router.delete('/favorites', asyncHandler( async (request, result) => {
  if (!request.query.city){
    result.status(404).send();
    return;
  }  
  await dao.delete(request.query.city);
  result.status(204).send();
}));

module.exports = {router, dao};