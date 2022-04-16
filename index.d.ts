declare module "steamweb.js" {
	export class SteamWeb {

		constructor(key: string);
		private endpoint: string;

		getNewsForApp(appId: string, count?: number, maxLength?: number): Promise<Array<{
			gId: string;
			title: string;
			url: string;
			author: string;
			contents: string;
			feedLabel: string;
			date: Date;
			feedName: string;
			appId: string;
		}>>;

		getGlobalAchievementPercentagesForApp(appId: string): Promise<Array<{
			apiName: string;
			percent: number;
		}>>;

		getPlayerSummaries(userId: string): Promise<{
			steamId: string;
			name: string | undefined;
			profileUrl: string;
			avatarUrl: string;
			avatarUrlMedium: string;
			avatarUrlFull: string;
			personaState: "Offline" | "Online" | "Busy" | "Away" | "Snooze" | "Looking to trade" | "Looking to play";
			realname: string | undefined;
			primaryClanId: string | undefined;
			lastLogOff: Date;
			timeCreated: Date;
			locCountryCode: string | undefined;
			locStateCode: string | undefined;
			locCityId: number | undefined;
		}>;

		getPlayersSummaries(userId: string[]): Promise<Array<{
			steamId: string;
			name: string | undefined;
			profileUrl: string;
			avatarUrl: string;
			avatarUrlMedium: string;
			avatarUrlFull: string;
			personaState: "Offline" | "Online" | "Busy" | "Away" | "Snooze" | "Looking to trade" | "Looking to play";
			realname: string | undefined;
			primaryClanId: string | undefined;
			lastLogOff: Date;
			timeCreated: Date;
			locCountryCode: string | undefined;
			locStateCode: string | undefined;
			locCityId: number | undefined;
		}>>;

		getFriendList(userId: string): Promise<Array<{
			steamId: string;
			friendsSince: Date | null;
		}> | false>;

		getPlayerAchievements(userId: string, appId: string, filterByAchieved?: boolean, lang?: string): Promise<Array<{
			name: string;
			description: string;
			apiName: string;
			achieved: boolean;
			unlockTime: Date | null;
		}>>;

		getUserStatsForGame(userId: string, appId: string): Promise<Array<{
			name: string;
			value: number;
		}>>;

		getOwnedGames(userId: string, includeAppInfo?: boolean, includeFreeGames?: boolean): Promise<{
			gameCount: number;
			games: Array<{
				appId: string;
				name: string | undefined;
				playtimeForever: number;
				imgIconUrl: string | undefined;
				hasCommunityVisibleStats: boolean | undefined;
				playtimeWindowsForever: number;
				playtimeMacForever: number;
				playtimeLinuxForever: number;
			}>;
		}>;

		getRecentlyPlayedGames(userId: string, count?: number): Promise<{
			gameCount: number;
			games: Array<{
				appId: game.appid;
				name: game.name;
				playtimeForever: game.playtime_forever;
				playtime2Weeks: game.playtime_2weeks;
				imgIconUrl: `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
				playtimeWindowsForever: game.playtime_windows_forever;
				playtimeMacForever: game.playtime_mac_forever;
				playtimeLinuxForever: game.playtime_linux_forever;
			}>
		}>;

		convertUsernameToId(username: string): Promise<string>;

		convertIdToUsername(userId: string): Promise<string>;

	}
}