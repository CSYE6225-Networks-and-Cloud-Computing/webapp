// setting response headers 
const setHeaders = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // response cache handler
    res.setHeader('Pragma', 'no-cache'); // request cache handler
    res.setHeader('X-Content-Type-Options', 'nosniff'); // content - file misinterpratetaion handler
    next(); 
};

module.exports = setHeaders;