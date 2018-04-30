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
  profile.alias = json.alias
  profile.email = json.email
  profile.language = json.language
  profile.plan = json.plan
  profile.provider = 'typeform'

  return profile
}
