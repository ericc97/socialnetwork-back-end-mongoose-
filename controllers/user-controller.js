const { Types } = require('mongoose');
const { User, Thought } = require('../models');
const { db } = require('../models/User');

const userController = {

    // GET all Users
    getAllUsers(req, res) {
       User.find()
        .populate({ path: 'thoughts', select:'-__v'})
        .populate({ path: 'friends', select:'-__v'})
        // .select('-__v')
        // .sort({ _id: -1 })
        .then(dbUserData =>  {
            console.log(dbUserData)
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);        
        })
    },

    // GET User by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.userId })
        .populate('thoughts')
        .populate({ path: 'friends', select: '-__v' })
        .select('-__v')
        .then(dbUserData => {
            console.log(dbUserData)
            // If no User found
            if(!dbUserData){
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        });
    },

    // Create User
    createUser({ body }, res){
       User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err))
    },

    // Update User by Id
    updateUser({ params, body }, res ) {
        User.findOneAndUpdate({ _id: params.userId }, body, {
            new: true,
            runValidators: true
        })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(400).json({ message: 'No User found with that id'})
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err))
    },

    // Delete User by Id
    deleteUser({ params }, res) {
        User.findOneAndDelete(
            {_id: params.userId},
            )
        // thought and friend delete currently don't work :/
        // Thought.deleteMany({
        //     username: params.username
        // })
        // User.updateMany(
        //     {
        //         friends: {
        //             _id: params.userId
        //         }
        //     },
        //     {
        //         $pull: { 
        //             friends: params.userId
        //         }
        //     }
        // )
        .then(dbUserData => {
            if(!dbUserData){
                res.status(400).json({ message: 'No user found with that id!'})
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => console.log(err).json(err))
    },

    createNewFriend({ params }, res) {
        
            // // check if user exists first
            // const friend = User.findOne({ _id: params.userId});

            // if(!friend){
            //     throw new Error(
            //         'Cannot add friend as user dosent exists'
            //     );
            // }

            // //check if friend is already in friends list
            // const checkFriend = User.findOne({
            //     _id: params.userId,
            //     friends: {
            //         _id: Types.ObjectId(params.friendId)
            //     }
            // });

            // // if yes return error
            // if (checkFriend){
            //     throw new Error(
            //         'Adding friend failed as they are already in your friends list dummy'
            //     )
            // }

            const updatedUser = User.findOneAndUpdate(
                {_id: params.userId},
                { $push: { friends: params.friendId} },
                { new: true }
            )
            .populate({ path: 'friends', select: '-__v'})
            .select('-__v')
            .then(dbUserData => {
                if(!dbUserData){
                    throw new Error(
                        'User Not Found'
                    )
                }
                res.json({
                    message: `Friend (${params.friendId}) added to friends list for user (${params.userId})`
                })
            });
    },

    deleteFriend({ params }, res){
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: {friends: params.friendId } },
            { new: true }
        )
        .select('-__v')
        .then(dbUserData => {
            if(!dbUserData){
                throw new Error(
                    'Deleting friend failed, No user found'
                )
            }
            res.json({
                message: `Friend ${params.friendId} has now been removed`
            })
        })
        
    },
};

module.exports = userController