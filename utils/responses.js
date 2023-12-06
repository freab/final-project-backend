const responses = {};

responses.getCustomResponse = (data, isError) => {
    if (isError) {
        return {
            success: false,
            data: null,
            error: data.message ? data.message : data.meta || "Internal error check the server log!!"
        };
    } else {
        return {
            success: true,
            data: data,
            error: null
        };
    }
}

module.exports = responses;