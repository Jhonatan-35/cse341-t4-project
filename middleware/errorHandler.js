module.exports = (err, req, res, next) => {
    const statusCode =  resStatusCode ? resStatusCode : 500;
    console.error(err.stack);

    switch (statusCode) {
        case 400:   
            res.status(statusCode).json({
                title: 'Bad Request',
                message: err.message || 'Internal Server Error',
                error: process.env.NODE_ENV === 'development' ? err : {}
            });
            break;
        case 401:
            res.status(statusCode).json({
                title: 'Unauthorized',
                message: err.message || 'Internal Server Error',
                error: process.env.NODE_ENV === 'development' ? err : {}
            });
            break;
        case 403:
            res.status(statusCode).json({
                title: 'Forbidden',
                message: err.message || 'Internal Server Error',
                error: process.env.NODE_ENV === 'development' ? err : {}
            });
            break;
        case 404:
            res.status(statusCode).json({
                title: 'Not Found',
                message: err.message || 'Internal Server Error',
                error: process.env.NODE_ENV === 'development' ? err : {}
            });
            break;
        case 500:
            res.status(statusCode).json({
                title: 'Internal Server Error',
                message: err.message || 'Internal Server Error',
                error: process.env.NODE_ENV === 'development' ? err : {}
            });
            break;
        default:
            console.log("No error, all good");
            break;
    }

};