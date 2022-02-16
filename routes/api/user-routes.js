const router = require('express').Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    createNewFriend,
    deleteFriend
} =  require('../../controllers/user-controller');

// Set up GET all and POST at /api/users
router
    .route('/')
    .get(getAllUsers)
    .post(createUser)

// Set up GET one, PUT and DELETE at /api/users/:id
router  
    .route('/:userId')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

// Set up POST and DELETE at /api/user/:userId/friends/:friendId
router  
    .route('/:userId/friends/:friendId')
    .post(createNewFriend)
    .delete(deleteFriend)

module.exports = router;