import { Base64Converter } from "../utils/Base64Converter";
import { defaults } from "../utils/base64Defaults";

import { ApiError } from "../utils/ErrorApi";
import { YouTubeApi } from "./YouTubeApi";
import axios from "axios";

type widgetConstructorType = {
  id?: string;
  type?: "last" | "popular";
  live?: boolean;
};
function formatNumber(num: number): string {
  if (!num) return "0";
  if (num >= 1_000_000_000)
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

export class UserWidgetService {
  static async widgetConstructor({
    id,
    type = "last",
    live = false,
  }: widgetConstructorType) {
    try {
      const user = await YouTubeApi.parseUserData({ id, type, live });
      const {
        title,
        username,
        createdAt,
        subs,
        views,
        videos,
        bannerImg,
        avatarImg,
        countryImg,
        country,
        description,
      } = await userData(user);
      const {
        videoLikes,
        videoViews,
        videoComments,
        videoTitle,
        base64LastUpload,
        videoType,
      } = await videoData(user);
      const { btnGradient, youtubeSvg } = await defaults();
      const widget = `<svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="500"
      height="303"
    >
      <style>
        *,
        *::after,
        *::before {
          padding: 0;
          margin: 0;
          box-sizing: border-box;
        }
        img {
          display: block;
        }
        #foreign {
          font-size: 62.5%;
          font-family: sans-serif;
          --contrast: #e70000;
          --hollow-text: #ffffffa6;
        }

        .wrapper {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          position: relative;
        }

        .header {
          display: flex;
          justify-content: center;
          position: absolute;
          width: 100%;

          margin-top: 0.3em;
        }

        .header__content {
          position: relative;
          background: var(--contrast);
          display: flex;
          border-radius: 0.6em;

          align-items: center;
          gap: 1em;
          padding: 0.3em 1.8em;

          overflow: hidden;
        }
        .header__content span {
          font-size: 1.25em;
          text-align: center;
          color: #fff;
          font-weight: 600;
        }
        .header__content img {
          width: 1.6em;
          aspect-ratio: 1/1;
        }
        .header__content::before,
        .header__content::after {
          width: 1.5em;
          aspect-ratio: 1/1;
          z-index: -1;
          position: absolute;
        }
        .header__content::before {
          bottom: 0;
          right: 100%;
          border-bottom-right-radius: 50%;
          box-shadow: 0.5em 0.5em 0 0.1em var(--contrast);
        }
        .header__content::after {
          bottom: 0;
          left: 100%;
          border-bottom-left-radius: 50%;
          box-shadow: -0.5em 0.5em 0 0.1em var(--contrast);
        }
        .banner__wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: -1;
        }
        .banner__wrapper::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: rgba(0, 0, 0, 50%);
        }
        .banner {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card {
          width: 100%;
          height: 100%;
          border-radius: 0.5em;
          position: relative;
          overflow: hidden;
          padding: 1em;
          clip-path: path(
            "M 0,0 L 177, 0 A 5,5 0,0,1 182, 5 L 182, 25 A 5,5 0,0,0 187, 30 L 307 ,30 A 5,5 0,0,0 312, 25 L 312, 5 A 5,5 0,0,1 317, 0 L 500, 0 L 500, 303 L 0, 303   Z"
          );
        }
        .pfp__wrapper {
          position: relative;
          width: fit-content;
        }
        .pfp {
          width: 12.8em;
          aspect-ratio: 1/1;
          object-fit: cover;
          border-radius: 50%;
          border: 0.3em solid var(--contrast);
        }
        .country {
          position: absolute;
          width: 2em;
          aspect-ratio: 1/1;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 1em;
          left: 1em;
        }
        .country span {
          font-size: 1em;
          text-align: center;
          font-weight: 600;
          z-index: 1;
          color: #000;
        }
        .country img {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        .main_data {
          font-weight: 400;
          color: #fff;
          display: grid;
          align-self: stretch;
          grid-template-rows: 1fr auto;
        }
        .title {
          max-width: 12.5em;
          font-size: 1.6em;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          -webkit-box-orient: vertical;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .username {
          font-size: 1em;
          max-width: 12.5em;
          margin-bottom: 0.3em;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          -webkit-box-orient: vertical;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .creation {
          font-size: 0.9em;
          font-weight: 300;
          color: var(--hollow-text);
        }
        .stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5em;
          align-self: end;
          position: absolute;
        }
        .stats__part {
          display: grid;
          align-content: space-between;
          justify-items: center;
          
        }
        .icon {
          width: 1.6em;
          filter: invert();
        }
        .stats__data {
          text-align: center;
          font-size: 1em;
          font-weight: 600;
          color: #fff;
        }

        .sub__wrapper {
          position: relative;
          padding: 0.125em;
          width: fit-content;
          border-radius: 3.2em;
          overflow: hidden;
        }

        .sub__wrapper img {
          width: 100%;
          aspect-ratio: 1/1;
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: -1;
          border-radius: 50%;
          transform: translate(-50%, -50%) rotateZ(0deg);
          transform-origin: center;
          animation: border 5s linear infinite;
        }

        .subscribe {
          font-size: 1.6em;
          font-weight: 500;
          padding: 0.1em 1.2em;
          border-radius: 3em;
          border: none;
          background: var(--contrast);
          color: #fff;
          position: relative;
        }

        .subscribe::after {
          content: "";
          position: absolute;
          inset: -0.125em;
          background: conic-gradient(
            from var(--rotat),
            red,
            orange,
            yellow,
            green,
            blue,
            purple,
            red
          );
          z-index: -1;
          border-radius: inherit;
        }

        @keyframes border {
          from {
            transform: translate(-50%, -50%) rotateZ(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotateZ(360deg);
          }
        }

        .description {
          font-size: 1.2em;
          color: #fff;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          line-clamp: 5;
          -webkit-box-orient: vertical;
          height: fit-content;
          word-break: break-all;
          margin-top: 0.8rem;
        }
        .video__section {
          color: #fff;
          z-index: 1;
          display: grid;
          width: fit-content;
          gap: 0.5em;
          margin-top: -15px;
        }
        .video__type {
          text-align: center;
          font-size: 1em;
        }
        .video__wrapper {
          position: relative;
          justify-self: center;
          border: 0.3em solid #81818173;
          border-radius: 0.5em;
          overflow: hidden;
        }
        .video__wrapper::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(transparent, #000);
        }
        .video__title {
          position: absolute;
          bottom: 0;
          left: 0;
          height: fit-content;
          margin: 0.5em;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }

        .live {
          position: absolute;
          font-size: 1em;
          font-weight: 600;
          text-align: center;
          padding: 0 0.5em;
          top: 1em;
          left: 1em;
          background: var(--contrast);
          border-radius: 0.3em;
          display: none;
        }
        .video__wrapper.online .live {
          display: block;
        }
        .video {
          width: 19.2em;
          aspect-ratio: 16/9;
          object-fit: cover;
        }
        .video__wrapper.online {
          border: 0.3em solid var(--contrast);
        }
        .video__stats {
          display: flex;
          justify-content: space-around;
        }
        .card-border {
          width: 100%;
          height: 100%;
          inset: 0;
          z-index: -1;
          background: var(--contrast);
          clip-path: path(
            "M 0,0 L 183, 0 A 5,5 0,0,1 188, 5 L 188, 25 A 5,5 0,0,0 193, 30 L 306 ,30 A 5,5 0,0,0 311, 25 L 311, 5 A 5,5 0,0,1 316, 0 L 500, 0 L 500, 303 L 0, 303   Z"
          );
          border-radius: 0.8em;
          padding: 0.3em;
        }
        .high-content {
          display: flex;
          align-items: center;
          gap: 1em;
        }
        .btn-wrapper {
          flex-grow: 1;
          justify-items: center;
        }
        .bottom-content {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2em;
        }
      </style>

      <foreignObject id="foreign" width="100%" height="100%" x="0" y="0">
        <div class="wrapper" xmlns="http://www.w3.org/1999/xhtml">
          <div class="header">
            <div class="header__wrapper">
              <div class="header__content">
                <span>YouTube</span>
                <img src="${youtubeSvg}" alt="YouTube icon" />
              </div>
            </div>
          </div>
          <div class="card-border">
            <div class="card">
              <div class="banner__wrapper">
                <img src="${bannerImg}" alt="" class="banner" />
              </div>
              <div class="high-content">
                <div class="pfp__wrapper">
                  ${country ? countryRender({ country, countryImg }) : ""}
                  <img src="${avatarImg}" alt="" class="pfp" />
                </div>
                <div class="main_data">
                  <div style="align-self: center">
                    <h1 class="title">${title}</h1>
                    <h2 class="username">${username}</h2>
                    <h3 class="creation">Created at: ${createdAt}</h3>
                  </div>
                  <div class="stats">
                    <div class="stats__part subs">
                      <svg
                        class="icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        ><path
                          d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"
                      /></svg>
                      <span class="stats__data">${subs}</span>
                    </div>
                    <div class="stats__part views">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon"
                        viewBox="0 -960 960 960"
                        ><path
                          d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"
                      /></svg>
                      <span class="stats__data">${views}</span>
                    </div>
                    <div class="stats__part videos">
                      <svg
                        class="icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        ><path
                          d="m460-380 280-180-280-180v360ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Z"
                      /></svg>
                      <span class="stats__data">${videos}</span>
                    </div>
                  </div>
                </div>
                <div class="btn-wrapper">
                  <div class="sub__wrapper">
                    <button class="subscribe">Subscribe</button>
                    <img
                      src="${btnGradient}"
                      alt=""
                      class="gradient"
                    />
                  </div>
                </div>
              </div>

              <div class="bottom-content">
                <p class="description">
                 ${description}
                </p>
                <div class="video__section">
                  <h4 class="video__type">${
                    videoType === "live"
                      ? "Live now"
                      : type === "last"
                      ? "Last published"
                      : "Most viewed"
                  }</h4>
                  <div class="video__wrapper ${
                    videoType === "live" ? "online" : ""
                  }">
                    <p class="video__title">
                      ${videoTitle}
                    </p>
                    <p class="live ">Live</p>
                    <img src="${base64LastUpload}" alt="" class="video " />
                  </div>
                  <div class="video__stats">
                    <div class="stats__part likes">
                      <svg
                        class="icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        ><path
                          d="M720-120H320v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h218q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14ZM240-640v520H80v-520h160Z"
                      /></svg>
                      <span class="stats__data">${videoLikes}</span>
                    </div>
                    <div class="stats__part views">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon"
                        viewBox="0 -960 960 960"
                        ><path
                          d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"
                      /></svg>
                      <span class="stats__data">${videoViews}</span>
                    </div>
                    <div class="stats__part comments">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon"
                        viewBox="0 -960 960 960"
                        ><path
                          d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80Zm-80 400q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720L720-240H160Z"
                      /></svg>
                      <span class="stats__data">${videoComments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </foreignObject>
    </svg>`;
      return widget;
    } catch (error) {
      throw ApiError.catchError(error, "Error in widgetService");
    }
  }
}

async function videoData(user: any) {
  const { videoDefault } = await defaults();
  const videoLikes = formatNumber(user?.video?.statistics.likeCount) || 0;
  const videoViews = formatNumber(user?.video?.statistics.viewCount) || 0;
  const videoComments = formatNumber(user?.video?.statistics.commentCount) || 0;
  const videoUrl = user?.video?.snippet.thumbnails.medium.url;
  const videoTitle = user?.video?.snippet.title || "No video yet";
  const base64LastUpload = videoUrl
    ? await Base64Converter.fromUrl(videoUrl)
    : videoDefault;
  const videoType = user?.video?.myType;
  return {
    videoLikes,
    videoViews,
    videoComments,
    videoUrl,
    videoTitle,
    base64LastUpload,
    videoType,
  };
}

async function userData(user: any) {
  const { bannerDefault } = await defaults();
  const bannerUrl =
    user?.channel.items?.[0]?.brandingSettings?.image?.bannerExternalUrl;
  const avatarUrl = user?.channel.items?.[0]?.snippet?.thumbnails?.high?.url;
  const title = user?.channel.items?.[0]?.snippet?.title || "Channel Name";
  const username = user?.channel.items?.[0]?.snippet?.customUrl || "@Username";
  const description = user?.channel.items?.[0]?.snippet?.description || "";
  const createdAt =
    user?.channel.items?.[0]?.snippet?.publishedAt || "00.00.00";

  const subs = formatNumber(
    user?.channel.items?.[0]?.statistics?.subscriberCount
  );
  const views = formatNumber(user?.channel.items?.[0]?.statistics?.viewCount);
  const videos = formatNumber(user?.channel.items?.[0]?.statistics?.videoCount);
  const base64Banner = bannerUrl
    ? await Base64Converter.fromUrl(bannerUrl)
    : bannerDefault;
  const base64Avatar = await Base64Converter.fromUrl(avatarUrl);
  const country = user?.channel.items?.[0]?.snippet?.country || null;
  let countryImg = "";
  if (country) {
    const countryUrl = country
      ? `https://flagcdn.com/w80/${country?.toLowerCase() || "us"}.png`
      : "";
    countryImg = await Base64Converter.fromUrl(countryUrl);
  }

  return {
    title,
    username,
    createdAt: new Date(createdAt).toLocaleTimeString(),
    subs,
    views,
    videos,
    bannerImg: base64Banner,
    avatarImg: base64Avatar,
    countryImg,
    country,
    description,
  };
}

function countryRender({ country, countryImg }: any) {
  if (!country) {
    return "";
  }
  return `<div class="country">
                    <span>${country}</span>
                    <img src="${countryImg}" alt="" />
                  </div>`;
}
