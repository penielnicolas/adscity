exports.csrfDebug = (req, res, next) => {
    console.log('🔐 CSRF Debug:');
    console.log('- Method:', req.method);
    console.log('- URL:', req.url);
    console.log('- Headers:', {
        'x-csrf-token': req.headers['x-csrf-token'],
        'xsrf-token': req.headers['xsrf-token'],
        'csrf-token': req.headers['csrf-token']
    });
    console.log('- Cookies:', req.cookies);
    console.log('- CSRF Token from req:', req.csrfToken ? 'Function exists' : 'No function');
    next();
};