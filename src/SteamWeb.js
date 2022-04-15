const fetch = require("node-fetch")
const xmljs = require("xml-js")

class SteamWeb {

	constructor(key) {
		this.key = key
		this.endpoint = "http://api.steampowered.com/"
	}

	async getNewsForApp(appId, count = 20, maxLength = 0) {

		if (typeof appId !== "string") throw new TypeError(`Expected "string", got "${typeof appId}"`)

		const res = await fetch(this.endpoint + `ISteamNews/GetNewsForApp/v0002/?appid=${appId}&count=${count}&maxlength=${maxLength}`).then(response => { return response.json() })
		let news = [];
		res.appnews.newsitems.forEach(item => {
			news.push({
				gId: item.gid,
				title: item.title,
				url: item.url,
				isExternalUrl: item.is_external_url,
				author: item.author,
				contents: item.contents,
				feedLabel: item.feedlabel,
				date: new Date(item.date * 1000),
				feedName: item.feedname,
				feedType: item.feed_type,
				appId: toString(item.appid)
			})
		})
		return news

	}

	async getGlobalAchievementPercentagesForApp(appId) {

		if (typeof appId !== "string") throw new TypeError(`Expected "string", got "${typeof appId}"`)

		const res = await fetch(this.endpoint + `ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${appId}`).then(response => { return response.json() })
		let achievements = [];
		res.achievementpercentages.achievements.forEach(achievement => {
			achievements.push({
				apiName: achievement.name,
				percent: achievement.percent
			})
		})
		return achievements

	}

	async getPlayerSummaries(userId) {

		if (typeof userId === "string") {
			let uID = userId
			if (isNaN(parseInt(uID))) {
				uID = await idFromUsername(uID)
			}
			const res = await fetch(this.endpoint + `ISteamUser/GetPlayerSummaries/v0002/?key=${this.key}&steamids=${uID}`).then(response => { return response.json() })
			let player = res.response.players[0]
			return {
				steamId: player.steamid,
				name: player.personaname,
				profileUrl: player.profileurl,
				avatarUrl: player.avatar,
				avatarUrlMedium: player.avatarmedium,
				avatarUrlFull: player.avatarfull,
				personaState: player.personastate,
				personaHash: player.personahash,
				realname: player.realname,
				primaryClanId: player.primaryclanid,
				lastLogOff: player.lastlogoff ? new Date(player.lastlogoff * 1000) : undefined,
				timeCreated: player.timecreated ? new Date(player.timecreated * 1000) : undefined,
				personaStateFlags: player.personastateflags,
				locCountryCode: player.loccountrycode,
				locStateCode: player.locstatecode,
				locCityId: player.loccityid,
			}
		} else if (typeof userId === "object" && checkArray(userId)) {
			var idArray = []
			for (let item in userId) {
				if (!isNaN(parseInt(userId[item]))) await idArray.push(userId[item])
				else {
					let id = await idFromUsername(userId[item])
					await idArray.push(id)
				}

			}
			const res = await fetch(this.endpoint + `ISteamUser/GetPlayerSummaries/v0002/?key=${this.key}&steamids=${idArray}`).then(response => { return response.json() })
			let players = [];
			res.response.players.forEach(player => {
				players.push({
					steamId: player.steamid,
					name: player.personaname,
					profileUrl: player.profileurl,
					avatarUrl: player.avatar,
					avatarUrlMedium: player.avatarmedium,
					avatarUrlFull: player.avatarfull,
					personaState: player.personastate,
					personaHash: player.personahash,
					realname: player.realname,
					primaryClanId: player.primaryclanid,
					lastLogOff: player.lastlogoff ? new Date(player.lastlogoff * 1000) : undefined,
					timeCreated: player.timecreated ? new Date(player.timecreated * 1000) : undefined,
					personaStateFlags: player.personastateflags,
					locCountryCode: player.loccountrycode,
					locStateCode: player.locstatecode,
					locCityId: player.loccityid,
				})
			})
			return players
		} else {
			throw new TypeError(`Expected "string | string[]", got "${typeof userId}"`)
		}

	}

	async getFriendList(userId) {

		if (typeof userId !== "string") throw new TypeError(`Expected "string", got "${typeof userId}"`)

		let uID = userId
		if (isNaN(parseInt(uID))) {
			uID = await idFromUsername(uID)
		}

		const res = await fetch(this.endpoint + `ISteamUser/GetFriendList/v0001/?key=${this.key}&steamid=${uID}&relationship=friend`).then(response => { return response.json() })

		if (!res.friendslist) return false

		let friends = [];
		res.friendslist.friends.forEach(user => {
			friends.push({
				steamId: user.steamid,
				friendsSince: user.friend_since === 0 ? undefined : user.friend_since
			})
		})
		return friends

	}

	async getPlayerAchievements(userId, appId, filterByAchieved = false, lang = "en") {

		if (typeof userId !== "string") throw new TypeError(`Expected "string", got "${typeof userId}"`)
		if (typeof appId !== "string") throw new TypeError(`Expected "string", got "${typeof appId}"`)

		let uID = userId
		if (isNaN(parseInt(uID))) {
			uID = await idFromUsername(uID)
		}

		const res = await fetch(this.endpoint + `ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${this.key}&steamid=${uID}&l=${lang}`).then(response => { return response.json() })

		if (!res || res.playerstats.success === false) return false

		let achievements = [];
		res.playerstats.achievements.forEach(achievement => {
			if (filterByAchieved && achievement.achieved === 0) return
			achievements.push({
				name: achievement.name,
				description: achievement.description,
				apiName: achievement.apiname,
				achieved: achievement.achieved === 1,
				unlockTime: achievement.unlocktime ? new Date(achievement.unlocktime * 1000) : null
			})
		})
		return achievements

	}

	async getUserStatsForGame(userId, appId) {

		if (typeof userId !== "string") throw new TypeError(`Expected "string", got "${typeof userId}"`)
		if (typeof appId !== "string") throw new TypeError(`Expected "string", got "${typeof appId}"`)

		let uID = userId
		if (isNaN(parseInt(uID))) {
			uID = await idFromUsername(uID)
		}

		const res = await fetch(this.endpoint + `ISteamUserStats/GetUserStatsForGame/v0002/?appid=${appId}&key=${this.key}&steamid=${uID}`).then(response => { return response.json() })
		return res.playerstats.stats

	}

	async getOwnedGames(userId, includeAppInfo = true, includeFreeGames = false) {

		if (typeof userId !== "string") throw new TypeError(`Expected "string", got "${typeof userId}"`)
		if (typeof includeAppInfo !== "boolean") throw new TypeError(`Expected "boolean", got "${typeof includeAppInfo}"`)
		if (typeof includeFreeGames !== "boolean") throw new TypeError(`Expected "boolean", got "${typeof includeFreeGames}"`)

		let uID = userId
		if (isNaN(parseInt(uID))) {
			uID = await idFromUsername(uID)
		}

		const res = await fetch(this.endpoint + `IPlayerService/GetOwnedGames/v0002/?key=${this.key}&steamid=${uID}&include_appinfo=${includeAppInfo}&include_played_free_games=${includeFreeGames}`).then(response => { return response.json() })

		if (!res.response || res.response.game_count === 0) return false

		let games = [];
		res.response.games.forEach(game => {
			games.push({
				appId: game.appid,
				name: game.name,
				playtimeForever: game.playtime_forever,
				imgIconUrl: `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
				hasCommunityVisibleStats: game.has_community_visible_stats,
				playtimeWindowsForever: game.playtime_windows_forever,
				playtimeMacForever: game.playtime_mac_forever,
				playtimeLinuxForever: game.playtime_linux_forever
			})
		})
		return {
			gameCount: res.response.game_count,
			games
		}

	}

	async getRecentlyPlayedGames(userId, count = undefined) {

		if (typeof userId !== "string") throw new TypeError(`Expected "string", got "${typeof userId}"`)
		if (count && typeof count !== "number") throw new TypeError(`Expected "number", got "${typeof count}"`)

		let uID = userId
		if (isNaN(parseInt(uID))) {
			uID = await idFromUsername(uID)
		}

		const res = await fetch(this.endpoint + `IPlayerService/GetRecentlyPlayedGames/v0001/?key=${this.key}&steamid=${uID}${typeof count !== "undefined" ? "&count=" + count : ""}`).then(response => { return response.json() })

		if (!res.response || res.response.total_count === 0) return false

		let games = [];
		res.response.games.forEach(game => {
			games.push({
				appId: game.appid,
				name: game.name,
				playtimeForever: game.playtime_forever,
				playtime2Weeks: game.playtime_2weeks,
				imgIconUrl: `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
				playtimeWindowsForever: game.playtime_windows_forever,
				playtimeMacForever: game.playtime_mac_forever,
				playtimeLinuxForever: game.playtime_linux_forever
			})
		})
		return {
			totalCount: res.response.total_count,
			games
		}

	}

}

/**
 * @private
 * @param {object} arr
 * @returns {boolean}
 */
function checkArray(arr) {
	try {
		arr[0]
		return true
	} catch (e) {
		return false
	}
}

/**
 * @param {string} username 
 * @returns {string} 
 */
async function idFromUsername(username) {
	let xml = JSON.parse(xmljs.xml2json(await (fetch(`https://steamcommunity.com/id/${username}/?xml=1`).then(response => { return response.text() }))))
	return xml.elements[0].elements[0].elements[0].text
}

module.exports = SteamWeb;