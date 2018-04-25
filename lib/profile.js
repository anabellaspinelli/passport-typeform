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
  profile.userId = String(json.user_id)
  profile.accountId = json.account_id
  profile.alias = json.alias
  profile.email = json.email
  profile.language = json.language

  return profile
}
