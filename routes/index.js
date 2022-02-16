const router = require('express').Router();


// Import all api routes
const apiRoutes = require('./api');


// add prefix /api to imported api routes
router.use('/api', apiRoutes);



router.use((req, res) => {
    res.status(404).send('<h1>😝 404 Error!</h1>');
});


module.exports = router;