import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";
import httpStatus from "http-status";

const loginUser = catchAsync(async(req, res)=>{
    const result = await AuthServices.loginUser(req.body);
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
    })
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Logged in successfully!",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange
        }
    })
})

const refreshToken = catchAsync(async(req, res)=>{
    const {refreshToken} = req.cookies
    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Logged in successfully!",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange
        }
    })
})


export const AuthControllers = {
    loginUser,
    refreshToken
}