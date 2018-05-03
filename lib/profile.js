/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */

exports.parse = function (json) {
  if (typeof json === 'string') {
    json = JSON.parse(json)
  }

  var profile = {}
  profile.language = json.language
  profile.email = json.email
  profile.alias = json.alias

  return profile
}
