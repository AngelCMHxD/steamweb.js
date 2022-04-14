declare module "steamweb.js" {
	export class SteamWeb {

		constructor(key: string);
		private endpoint: string;

		getNewsForApp(appId: string, count?: number, maxLength?: number): Promise<Array<{
			gid: string;
			title: string;
			url: string;
			is_external_url: boolean;
			author: string;
			contents: string;
			feedlabel: string;
			date: number;
			feedname: string;
			feed_type: number;
			appid: number;
		}>>;

		getGlobalAchievementPercentagesForApp(appId: string): Promise<Array<{
			apiname: string,
			percent: number
		}>>;

		getPlayerSummaries(userId: string | string[]): Promise<{
			steamId: string,
			name: string | undefined,
			profileUrl: string,
			avatarUrl: string,
			avatarUrlMedium: string,
			avatarUrlFull: string,
			personaState: string,
			personaHash: string,
			realname: string | undefined,
			primaryClanId: string | undefined,
			lastLogOff: number | undefined,
			timecreated: number,
			personastateflags: number,
			loccountrycode: string | undefined,
			locstatecode: string | undefined,
			loccityid: number | undefined,
		} | Array<{
			steamId: string,
			name: string | undefined,
			profileUrl: string,
			avatarUrl: string,
			avatarUrlMedium: string,
			avatarUrlFull: string,
			personaState: string,
			personaHash: string,
			realname: string | undefined,
			primaryClanId: string | undefined,
			lastLogOff: number | undefined,
			timecreated: number,
			personastateflags: number,
			loccountrycode: string | undefined,
			locstatecode: string | undefined,
			loccityid: number | undefined,
		}>>;

		getFriendList(userId: string): Promise<Array<{
			steamid: string;
			friendsSince: number;
		}> | false>;

		getPlayerAchievements(userId: string, appId: string, lang?: string): Promise<Array<{
			name: string;
			description: string;
			apiName: string;
			achieved: boolean;
			unlocktime: number | undefined;
		}>>;

		getUserStatsForGame(userId: string, appId: string): Promise<Array<{
			name: string;
			value: number;
		}>>;

		getOwnedGames(userId: string, includeAppInfo?: boolean, includeFreeGames?: boolean): Promise<{
			gameCount: number;
			games: Array<{
				appid: string;
				name: string | undefined;
				playtime_forever: number;
				img_icon_url: string | undefined;
				has_community_visible_stats: boolean | undefined;
				playtime_windows_forever: number;
				playtime_mac_forever: number;
				playtime_linux_forever: number;
			}>;
		}>;

		getRecentlyPlayedGames(userId: string, count?: number): Promise<Array<>>;

	}
}