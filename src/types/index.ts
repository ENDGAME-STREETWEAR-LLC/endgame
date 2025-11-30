import {
  ProfileFromUserNameResponse,
  TitleThinTrophy,
  UserTitlesResponse,
} from "psn-api";

export enum Services {
  PSN,
  XBL,
  Steam,
}

export interface PSNData {
  profile: ProfileFromUserNameResponse["profile"];
  titles: UserTitlesResponse;
  trophies: { [x: string]: TitleThinTrophy[] }[];
}

export interface XBLData {
  profile: XBLProfileData;
  achievements: XBLAchievementsData;
}

export interface SteamData {
  profile: SteamProfileData;
  games: SteamGamesData;
  achievements: SteamAchievementsData;
}

export interface GamingServicesData {
  psn: null | PSNData;
  xbl: null | XBLData;
  steam: null | SteamData;
}

export interface GamingSessionValue {
  psn: undefined | string;
  xbl: undefined | string;
  steam: undefined | string;
}

export interface GamingServicesAuthState {
  psn: boolean;
  xbl: boolean;
  steam: boolean;
}

export type GamingServicesHook = [
  boolean,
  string,
  (service: Services) => void,
  GamingServicesData,
  GamingServicesAuthState
];

/**
 * PSN Auth Session stored inside the browser's cookies, containing an authorization object for the signed in user.
 */
export interface PSNAuthSession {
  accessToken: string;
  expiresIn: number;
  idToken: string;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  scope: string;
  tokenType: "bearer";
}

/**
 * Xbox Live Auth Session stored inside the browser's cookies, containing an authorization object for the signed in user.
 */
export interface XBLAuthSession {
  app_key: string;
  avatar: string;
  email: string;
  gamertag: string;
  xuid: string;
}

/**
 * Steam Auth Session stored inside the browser's cookies, contaning a Steam ID string for the signed in user.
 */
export type SteamAuthSession = string;

/**
 * Contains achievements data from an Xbox Live Account.
 */
export type XBLAchievementsData = {
  titleId: string;
  pfn: string;
  bingId?: string;
  windowsPhoneProductId?: string;
  name: string;
  type: string;
  devices: string[];
  displayImage: string;
  mediaItemType: string;
  modernTitleId: string;
  isBundle: boolean;
  achievement: {
    currentAchievements: number;
    totalAchievements: number;
    currentGamerscore: number;
    totalGamerscore: number;
    progressPercentage: number;
    sourceVersion: number;
  };
  stats: {
    sourceVersion: number;
  };
  gamePass?: unknown;
  images?: unknown;
  titleHistory: {
    lastTimePlayed: string;
    visible: boolean;
    canHide: boolean;
  };
  titleRecord?: unknown;
  detail?: unknown;
  friendsWhoPlayed?: unknown;
  alternateTitleIds?: unknown;
  contentBoards?: unknown;
  xboxLiveTier: string;
  achievements: {
    id: string;
    serviceConfigId: string;
    name: string;
    titleAssociations: {
      name: string;
      id: number;
    }[];
    progressState: string;
    progression: {
      requirements: unknown[];
      timeUnlocked: string;
    };
    mediaAssets: {
      name: string;
      type: string;
      url: string;
    }[];
    platforms: string[];
    isSecret: boolean;
    description: string;
    lockedDescription: string;
    productId: string;
    achievementType: string;
    participationType: string;
    timeWindow?: unknown;
    rewards: {
      name?: string;
      description?: string;
      value: string;
      type: string;
      mediaAsset?: unknown;
      valueType: string;
    }[];
    estimatedTime: string;
    deeplink: string;
    isRevoked: boolean;
    rarity: {
      currentCategory: string;
      currentPercentage: number;
    };
  }[];
}[];

/**
 * Contains profile data from an Xbox Live Account.
 */
export interface XBLProfileData {
  id: string;
  hostId: string;
  settings: {
    id: string;
    value: string;
  }[];
  isSponsoredUser: boolean;
}

/**
 * Contains achievements data from a Steam Account.
 */
export interface SteamAchievementsData {
  response: {
    game_count: number;
    games: {
      name: string;
      id: number;
      achievements: {
        apiname: string;
        achieved: 0 | 1;
        unlocktime: 0;
      }[];
    }[];
  };
}

/**
 * Contains game data from a Steam Account.
 */
export interface SteamGamesData {
  response: {
    game_count: number;
    games: {
      name: string;
      appid: number;
      playtime_forever: number;
      playtime_windows_forever: number;
      playtime_mac_forever: number;
      playtime_deck_forever: number;
      rtime_last_played: number;
      playtime_disconnected: number;
    }[];
  };
}

/**
 * Contains profile data from a Steam Account.
 */
export interface SteamProfileData {
  response: {
    players: {
      steamid: string;
      communityvisibilitystate: number;
      profilestate: number;
      personaname: string;
      commentpermission: number;
      profileurl: string;
      avatar: string;
      avatarmedium: string;
      avatarfull: string;
      avatarhash: string;
      lastlogoff: number;
      personastate: number;
      realname: string;
      primaryclanid: string;
      timecreated: number;
      personastateflags: number;
      loccountrycode: string;
      locstatecode: string;
      loccityid: number;
    }[];
  };
}
