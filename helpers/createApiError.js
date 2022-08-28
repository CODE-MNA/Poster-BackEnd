const createApiError = (message, status) => {
    const error = new Error(message);
    error.status = status;
    return error;
}

//DO NOT THROW ERROR INSIDE PROMISE CATCH, BAD CODE
const ThrowApiError = (message,status) => {
    throw  createApiError(message,status);
};

const modifyError = (error,message,status,customOnly = true) => {
    if(customOnly){
        error.message = message;
    }else{
        error.message = message +' -> ' + error.message; 
    }
    error.status = status;
    return error;
}
exports.modifyError = modifyError;
exports.createApiError = createApiError;
exports.ThrowApiError = ThrowApiError;
