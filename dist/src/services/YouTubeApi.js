"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeApi = void 0;
const axios_1 = __importDefault(require("axios"));
const ErrorApi_1 = require("../utils/ErrorApi");
const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL || "";
const youtubeApiRequest = (endpoint, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get(`${BASE_URL}/${endpoint}`, {
            params: Object.assign(Object.assign({}, params), { key: API_KEY }),
        });
        return data;
    }
    catch (error) {
        throw ErrorApi_1.ApiError.catchError(error, `YouTube API Error at '${endpoint}  + PARAMS ${JSON.stringify(params)}'`);
    }
});
class YouTubeApi {
    static parseUserData(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, type, live }) {
            try {
                const channelParts = [
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
                const [channelData] = yield Promise.all([
                    youtubeApiRequest(channelQueries.param, channelQueries.queries),
                ]);
                if (channelData.pageInfo.totalResults < 1) {
                    throw new ErrorApi_1.ApiError(404, true, "Id is not valid", "No channel data, id may be wrong");
                }
                const videoData = yield this.getVideo({ id, type, live });
                return { channel: channelData, video: videoData };
            }
            catch (error) {
                throw ErrorApi_1.ApiError.catchError(error, "Youtube API ERROR");
            }
        });
    }
    static getLastPublish(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const lastPublishedParts = ["snippet"];
                const lastPublishedQueries = {
                    param: "search",
                    queries: {
                        part: lastPublishedParts.join(","),
                        channelId: id,
                        order: "date",
                        type: "video",
                    },
                };
                const lastPublishedData = yield youtubeApiRequest(lastPublishedQueries.param, lastPublishedQueries.queries);
                return lastPublishedData.items[0] || null;
            }
            catch (error) {
                throw ErrorApi_1.ApiError.catchError(error, "Youtube API ERROR while getting last publish");
            }
        });
    }
    static getMostViewed(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const mostViewedParts = ["snippet"];
                const mostViewedQueries = {
                    param: "search",
                    queries: {
                        part: mostViewedParts.join(","),
                        channelId: id,
                        order: "viewCount",
                        type: "video",
                    },
                };
                const mostViewedData = yield youtubeApiRequest(mostViewedQueries.param, mostViewedQueries.queries);
                return mostViewedData.items[0];
            }
            catch (error) {
                throw ErrorApi_1.ApiError.catchError(error, "Youtube API ERROR while getting most viewed");
            }
        });
    }
    static getLive(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const mostViewedParts = ["snippet"];
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
                const mostViewedData = yield youtubeApiRequest(mostViewedQueries.param, mostViewedQueries.queries);
                const data = mostViewedData.items.find((video) => {
                    return video.snippet.liveBroadcastContent === "live";
                });
                return data || null;
            }
            catch (error) {
                throw ErrorApi_1.ApiError.catchError(error, "Youtube API ERROR while getting most viewed");
            }
        });
    }
    static moreVideoData(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const moreVideoDataParts = [
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
                const moreVideoData = yield youtubeApiRequest(moreVideoDataQueries.param, moreVideoDataQueries.queries);
                return moreVideoData.items[0];
            }
            catch (error) {
                throw ErrorApi_1.ApiError.catchError(error, "Youtube API ERROR while getting most viewed");
            }
        });
    }
    static getVideo(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, type, live }) {
            try {
                //First of all we have check if is live avaibles
                if (live) {
                    const isLIve = () => __awaiter(this, void 0, void 0, function* () {
                        return yield YouTubeApi.getLive({ id });
                    });
                    const liveData = yield isLIve();
                    if (liveData) {
                        const data = yield this.moreVideoData({
                            id: liveData.id.videoId,
                        });
                        return Object.assign(Object.assign({}, data), { myType: "live" });
                    }
                }
                let data;
                if (type === "last") {
                    data = yield YouTubeApi.getLastPublish({ id });
                }
                else {
                    data = yield YouTubeApi.getMostViewed({ id });
                }
                if (data) {
                    const videoData = yield this.moreVideoData({ id: data.id.videoId });
                    return Object.assign(Object.assign({}, videoData), { myType: "video" });
                }
            }
            catch (error) {
                throw ErrorApi_1.ApiError.catchError(error, "Youtube API ERROR while getting video");
            }
        });
    }
}
exports.YouTubeApi = YouTubeApi;
