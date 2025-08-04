import axios, { AxiosError } from "axios";
import { ApiError } from "../utils/ErrorApi";
type userData = {
  id?: string;
  type?: "last" | "popular";
  live?: boolean;
};
type ApiParams = {
  [key: string]: string | number | string[] | undefined;
};
const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL || "";
const youtubeApiRequest = async (endpoint: string, params: ApiParams) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${endpoint}`, {
      params: { ...params, key: API_KEY },
    });
    return data;
  } catch (error) {
    throw ApiError.catchError(
      error,
      `YouTube API Error at '${endpoint}  + PARAMS ${JSON.stringify(params)}'`
    );
  }
};
export class YouTubeApi {
  static async parseUserData({ id, type, live }: userData) {
    try {
      const channelParts = <string[]>[
        "snippet",
        "statistics",
        "brandingSettings",
        "contentDetails",
        "contentOwnerDetails",
        "localizations",
        "status",
        "topicDetails",
      ];
      const channelQueries = {
        param: "channels",
        queries: {
          part: channelParts.join(","),
          id,
        },
      };

      const [channelData] = await Promise.all([
        youtubeApiRequest(channelQueries.param, channelQueries.queries),
      ]);

      if (channelData.pageInfo.totalResults < 1) {
        throw new ApiError(
          404,
          true,
          "Id is not valid",
          "No channel data, id may be wrong"
        );
      }

      const videoData = await this.getVideo({ id, type, live });

      return { channel: channelData, video: videoData };
    } catch (error: any) {
      throw ApiError.catchError(error, "Youtube API ERROR");
    }
  }

  static async getLastPublish({ id }: userData) {
    try {
      const lastPublishedParts = <string[]>["snippet"];
      const lastPublishedQueries = {
        param: "search",
        queries: {
          part: lastPublishedParts.join(","),
          channelId: id,
          order: "date",
          type: "video",
        },
      };

      const lastPublishedData = await youtubeApiRequest(
        lastPublishedQueries.param,
        lastPublishedQueries.queries
      );

      return lastPublishedData.items[0] || null;
    } catch (error) {
      throw ApiError.catchError(
        error,
        "Youtube API ERROR while getting last publish"
      );
    }
  }

  static async getMostViewed({ id }: userData) {
    try {
      const mostViewedParts = <string[]>["snippet"];
      const mostViewedQueries = {
        param: "search",
        queries: {
          part: mostViewedParts.join(","),
          channelId: id,
          order: "viewCount",
          type: "video",
        },
      };

      const mostViewedData = await youtubeApiRequest(
        mostViewedQueries.param,
        mostViewedQueries.queries
      );

      return mostViewedData.items[0];
    } catch (error) {
      throw ApiError.catchError(
        error,
        "Youtube API ERROR while getting most viewed"
      );
    }
  }

  static async getLive({ id }: userData) {
    try {
      const mostViewedParts = <string[]>["snippet"];
      const mostViewedQueries = {
        param: "search",
        queries: {
          part: mostViewedParts.join(","),
          channelId: id,

          order: "date",
          type: "video",
          eventType: "live",
        },
      };

      const mostViewedData = await youtubeApiRequest(
        mostViewedQueries.param,
        mostViewedQueries.queries
      );

      const data = mostViewedData.items.find((video: any) => {
        return video.snippet.liveBroadcastContent === "live";
      });

      return data || null;
    } catch (error) {
      throw ApiError.catchError(
        error,
        "Youtube API ERROR while getting most viewed"
      );
    }
  }

  static async moreVideoData({ id }: userData) {
    try {
      const moreVideoDataParts = <string[]>[
        "contentDetails",
        "snippet",
        "id",
        "liveStreamingDetails",
        "localizations",
        "player",
        "recordingDetails",
        "statistics",
        "status",
        "topicDetails",
      ];
      const moreVideoDataQueries = {
        param: "videos",
        queries: {
          part: moreVideoDataParts.join(","),
          id,
        },
      };

      const moreVideoData = await youtubeApiRequest(
        moreVideoDataQueries.param,
        moreVideoDataQueries.queries
      );

      return moreVideoData.items[0];
    } catch (error) {
      throw ApiError.catchError(
        error,
        "Youtube API ERROR while getting most viewed"
      );
    }
  }

  static async getVideo({ id, type, live }: userData) {
    try {
      //First of all we have check if is live avaibles

      if (live) {
        const isLIve = async () => {
          return await YouTubeApi.getLive({ id });
        };

        const liveData = await isLIve();
        if (liveData) {
          const data = await this.moreVideoData({
            id: liveData.id.videoId,
          });
          return { ...data, myType: "live" };
        }
      }
      let data;
      if (type === "last") {
        data = await YouTubeApi.getLastPublish({ id });
      } else {
        data = await YouTubeApi.getMostViewed({ id });
      }
      if (data) {
        const videoData = await this.moreVideoData({ id: data.id.videoId });
        return { ...videoData, myType: "video" };
      }
    } catch (error) {
      throw ApiError.catchError(error, "Youtube API ERROR while getting video");
    }
  }
}
