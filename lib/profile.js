/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function(json) {
  if (typeof json === 'string') {
    json = JSON.parse(json);
  }

  var profile = {};
  profile.id = String(json.id);
  profile.name = json.name;
  // profile.username = json.login;
  profile.profileUrl = json.html_url;
  profile.email = json.email;

  // if (json.avatar_url) {
  //   profile.photos = [{ value: json.avatar_url }];
  // }

  return profile;
};
