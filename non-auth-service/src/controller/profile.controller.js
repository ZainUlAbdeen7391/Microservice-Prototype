const profileService = require('../service/profile.service');

function getProfile(req, res) {
  res.json(profileService.getProfile());
}

function updateProfile(req, res) {
  res.json(profileService.updateProfile());
}

module.exports = { getProfile, updateProfile };



