function _formatError(message) {
    return {
        message,
        datetime: new Date().getTime()
    };
}

export function publishError(errorList, message) {
    errorList.push(_formatError(message));
}
