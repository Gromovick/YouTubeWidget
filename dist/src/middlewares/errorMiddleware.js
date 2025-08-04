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
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const ErrorApi_1 = require("../utils/ErrorApi");
const base64Defaults_1 = require("../utils/base64Defaults");
function errorHandler(err, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.error("Error caught:", err);
        if (err instanceof ErrorApi_1.ApiError) {
            if (err.status === 404) {
                const { bannerDefault, youtubeSvg, error404 } = yield (0, base64Defaults_1.defaults)();
                res.set("Cache-Control", "s-maxage=1, stale-while-revalidate");
                res.set("Content-Type", "image/svg+xml");
                return res.send(`
      <svg xmlns="http://www.w3.org/2000/svg"
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
        .content {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        .main {
          width: 30em;
          margin-bottom: 1em;
          overflow: visible;
        }

        .main path {
          stroke: #fff;
          stroke-width: 3;
          stroke-dashoffset: 600;
          stroke-dasharray: 600;
          fill: transparent;
          animation: jump 6s ease-in-out infinite,
            stroke 6s ease-in-out infinite;
          animation-delay: 2s, 0s;
          transform-origin: center;
          transition: filter 0.3s ease;
        }

        @keyframes stroke {
          0% {
            stroke-dashoffset: 600;
            stroke-dasharray: 600;
          }
          8.3% {
            fill: transparent;
          }
          16.7% {
            stroke-dashoffset: 0;
            stroke: #fff;
            fill: #fff;
          }

          33.4% {
            stroke-dashoffset: 0;
            stroke: #fff;
            fill: #fff;
          }
          41.7% {
            fill: var(--contrast);
            stroke: var(--contrast);
          }
          50.1% {
            stroke-dashoffset: 0;
            fill: #fff;
            stroke: #fff;
          }
          66.8% {
            stroke-dashoffset: 0;
            fill: #fff;
            stroke: #fff;
          }
          75.1% {
            fill: transparent;
          }
          83.4% {
            stroke-dashoffset: 600;
            stroke-dasharray: 600;
          }
          100% {
            stroke-dashoffset: 600;
            stroke-dasharray: 600;
          }
        }

        @keyframes jump {
          0% {
            transform: translateY(0%);
          }
          8.3% {
            transform: translateY(-30%);
          }
          16.7% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(0%);
          }
        }

        .sub {
          text-align: center;
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
                <img src="${bannerDefault}" alt="" class="banner" />
              </div>
              <div class="content">
                <div>
                  <svg
                    class="main"
                    viewBox="0 0 290 113"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <path
                      d="M0.0951709 91.0795V73.1577L45.0312 2.36363H60.483V27.1704H51.3381L23.0099 72.0014V72.8423H86.8665V91.0795H0.0951709ZM51.7585 110V85.6136L52.179 77.6776V2.36363H73.5171V110H51.7585ZM144.232 112.365C135.192 112.33 127.414 110.105 120.897 105.69C114.415 101.276 109.422 94.8812 105.918 86.5071C102.45 78.133 100.733 68.0597 100.768 56.2869C100.768 44.5492 102.502 34.5459 105.971 26.277C109.475 18.008 114.468 11.7187 120.95 7.40909C127.467 3.06439 135.228 0.892041 144.232 0.892041C153.237 0.892041 160.98 3.06439 167.462 7.40909C173.979 11.7538 178.99 18.0606 182.494 26.3295C185.997 34.5634 187.732 44.5492 187.697 56.2869C187.697 68.0947 185.945 78.1856 182.441 86.5597C178.972 94.9337 173.997 101.328 167.515 105.743C161.033 110.158 153.272 112.365 144.232 112.365ZM144.232 93.4972C150.399 93.4972 155.322 90.3963 159.001 84.1946C162.68 77.9929 164.502 68.6903 164.467 56.2869C164.467 48.1231 163.626 41.3258 161.944 35.8949C160.297 30.464 157.95 26.3821 154.901 23.6491C151.888 20.9162 148.332 19.5497 144.232 19.5497C138.101 19.5497 133.195 22.6155 129.516 28.7472C125.837 34.8788 123.98 44.0587 123.945 56.2869C123.945 64.5559 124.769 71.4583 126.415 76.9943C128.097 82.4953 130.462 86.6297 133.511 89.3977C136.559 92.1307 140.133 93.4972 144.232 93.4972ZM202.294 91.0795V73.1577L247.23 2.36363H262.682V27.1704H253.537L225.209 72.0014V72.8423H289.066V91.0795H202.294ZM253.958 110V85.6136L254.378 77.6776V2.36363H275.716V110H253.958Z"
                      fill="white"
                    />
                  </svg>
                  <h2 class="sub">Client ERROR. Can not find such user</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </foreignObject> 
      </svg>`);
            }
            return res.status(err.status).json(err);
        }
        // Default handler
        return res.status(500).json({
            message: "Internal Server Error",
            myMessage: "Something went wrong",
        });
    });
}
