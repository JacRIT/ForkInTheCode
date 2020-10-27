/** Module providing user implementation for routes
 * @module controllers/profilecontroller
 */

const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../models/user");

const profileController = {};

/**
 * functionality for getting the profile
 * @name getProfile
 * @function
 * @alias module:/controllers/profilecontroller
 * @property {request} request - contains user
 * @returns {string} response - the user profile or error if not found
 */
profileController.getProfile = async function (req, res) {
	let profile = await req.user.getProfile();
	data = {
		firstname: profile.name.first,
		lastname: profile.name.last,
		dob: profile.dateOfBirth,
		education: profile.education,
		career: profile.career,
	}
	res.status(200).send(data);
};

/**
 * functionality for setting the profile
 * @name postProfile
 * @function
 * @alias module:/controllers/profilecontroller
 * @property {request} request - contains user
 * @returns {string} response - that profile was successfully updated
 */
profileController.postProfile = async function (req, res) {
  let profile = await req.user.getProfile();
  profile.name.first = req.body.firstname;
  profile.name.last = req.body.lastname;
  if (req.body.dob){
	profile.dateOfBirth = Date.parse(req.body.dob);
  }
  if (req.body.education){
	for (i = 0; i < req.body.education.length; i++) {
	  let education = req.body.education[i];
      await profile.addEducation(education.degree, education.major, Date.parse(education.gradDate), education.institution);
    }
  }
  if (req.body.career){
    for (i = 0; i < req.body.career.length; i++) {
      let career = req.body.career[i];
      await profile.addJob(career.jobTitle, career.organization);
    }
  }
  profile.save();
  res.status(200).send('Profile Updated.');
};

module.exports = profileController;