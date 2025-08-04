"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
const axios_1 = require("axios");
class ApiError extends Error {
    constructor(status, isOperational, message, myMessage, error) {
        super(message);
        this.otherMessage = JSON.stringify(message);
        this.name = "ApiError";
        this.status = status;
        this.isOperational = isOperational;
        this.myMessage = myMessage;
        this.error = error;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }
    static catchError(error, defaultMessage = "Something went wrong") {
        var _a, _b, _c, _d;
        if (error instanceof ApiError)
            return error;
        if (error instanceof axios_1.AxiosError) {
            const axiosError = error.response;
            return new ApiError(axiosError.status, false, (_a = axiosError.data) !== null && _a !== void 0 ? _a : defaultMessage, (_b = error === null || error === void 0 ? void 0 : error.myMessage) !== null && _b !== void 0 ? _b : defaultMessage);
        }
        return new ApiError(500, false, (_c = error === null || error === void 0 ? void 0 : error.message) !== null && _c !== void 0 ? _c : defaultMessage, (_d = error === null || error === void 0 ? void 0 : error.myMessage) !== null && _d !== void 0 ? _d : defaultMessage);
    }
}
exports.ApiError = ApiError;
