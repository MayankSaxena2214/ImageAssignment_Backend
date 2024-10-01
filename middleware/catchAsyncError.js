import { ErrorHandler } from "./error.js"

export const catchAsyncError = (theFunction) => {
    return (req, res, next) => {  // Include 'next' for proper error handling in Express
        Promise.resolve(theFunction(req, res, next)).catch((err) => {
            next(new ErrorHandler(err.message, err.statusCode || 500));
        });
    };
};