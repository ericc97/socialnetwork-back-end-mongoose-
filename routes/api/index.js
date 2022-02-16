const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');

// add prefix of /users to routes created in user-routes
router.use('/users', userRoutes);
// add prefix /thoughts to routes created in thought-routes
router.use('/thoughts', thoughtRoutes);

module.exports = router;