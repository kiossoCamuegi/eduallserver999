const sanitizeHtml = require('sanitize-html')

const clean = (data) => {
    data = JSON.stringify(data)

    data = sanitizeHtml(data, {
        // Configuration options
    })

    data = JSON.parse(data)

    return data
}


const Sanitize = () => {
    return (req, res, next) => {
        if (Object.keys(req.body).length > 0 && req.body.constructor === Object) {
            req.body = clean(req.body);
        }

        if (Object.keys(req.query).length > 0 && req.query.constructor === Object) {
            req.query = clean(req.query);
        }

        if (Object.keys(req.params).length > 0 && req.params.constructor === Object) {
            req.params = clean(req.params);
        }

        next()
    }
}


/*
A middleware function called sanitize that sanitizes the request body, query parameters, and route parameters.

Check if the req.body, req.query, and req.params objects exist and are not empty. 
If they pass the if check, call the clean() function with each object.

Finally, call the next function to pass control to the next middleware or route handler in the Express middleware chain.
*/

module.exports = Sanitize;