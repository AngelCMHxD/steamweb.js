const fetch = require("node-fetch")
const xmljs = require("xml-js")

class Client {
	/**
	 * @param {String} key 
	 */
	constructor(key) {
		this.key = key
		/**@private */
		this.endpoint = "http://api.steampowered.com/"
	}


	/**
	 * @param {String | String[]} userId
	 */
	async getPlayerInfo(userId) {

		if (typeof userId === "string") {
			let uID = userId
			if (isNaN(parseInt(uID))) {
				uID = await idFromUsername(uID)
			}
			const a = await fetch(this.endpoint + `ISteamUser/GetPlayerSummaries/v0002/?key=${this.key}&steamids=${uID}`).then(a => { return a.json() })
			return a.response.players[0]
		} else if (typeof userId === "object" && checkArray(userId)) {
			var arrr = []
			for (let item in userId) {
				if (!isNaN(parseInt(userId[item]))) await arrr.push(userId[item])
				else {
					let id = await idFromUsername(userId[item])
					await arrr.push(id)
				}

			}
			console.log(arrr)
			const a = await fetch(this.endpoint + `ISteamUser/GetPlayerSummaries/v0002/?key=${this.key}&steamids=${arrr}`).then(a => { return a.json() })
			return a.response.players
		} else {
			throw new TypeError(`Expected "string | string[]", got "${typeof userId}"`)
		}

	}

}

/**
 * @private
 * @param {Array} arr
 */
function checkArray(arr) {
	try {
		arr[0]
		return true
	} catch (e) {
		return false
	}
}

async function idFromUsername(username) {
	let xml = JSON.parse(xmljs.xml2json(await (fetch(`https://steamcommunity.com/id/${username}/?xml=1`).then(a => { return a.text() }))))
	return xml.elements[0].elements[0].elements[0].text
}

module.exports = Client;