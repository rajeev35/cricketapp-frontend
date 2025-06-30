// src/api/matches.js
import client from './index';

// Create a new match
export const createMatch = ({ format, date, location }) =>
  client.post('/matches', { format, date, location });

// Fetch all matches (or you can add query params)
export const listMatches = () =>
  client.get('/matches');

// Fetch one match’s live score
export const getMatchScore = (matchId) =>
  client.get(`/matches/${matchId}/score`);

// Perform a toss
export const toss = (matchId) =>
  client.post(`/matches/${matchId}/toss`);

export default {
  createMatch,
  listMatches,
  getMatchScore,
  toss,
};
