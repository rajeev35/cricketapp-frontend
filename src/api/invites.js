// src/api/invites.js
import client from './index';

// Send an invite to a user
export const sendInvite = (matchId, username) =>
  client.post(`/matches/${matchId}/invite`, { username });

// List pending invites for current user
export const listInvites = () =>
  client.get('/invites');

// Respond to an invite
export const respondInvite = (inviteId, accept) =>
  client.post(`/invites/${inviteId}/respond`, { accept });

export default {
  sendInvite,
  listInvites,
  respondInvite,
};
