const req = require('express/lib/request');
const { User, Thought } = require('../models');
const { db } = require('../models/User');


const thoughtController = {
    // add Thought to User
    getAllThoughts(req, res) {
        Thought.find({})
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'no user found with that id'})
                return;
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    },

    createThought({ body }, res ){
        try{
            Thought.create( body )
            .then(dbThoughtData => {
                return User.findOneAndUpdate(
                { _id: body.userId}, 
                { $push: {thoughts: dbThoughtData._id}},
                { new: true }
                )
            }) .then(dbUserData => res.json(dbUserData))
        //     const user = User.findOne({ username: body.username });

        //     if(!user) {
        //         throw new Error(
        //             'No User found with that id'
        //         )
        //     }

        //     const createThought = Thought.create(body);

        //     const updateUSer = User.findOneAndUpdate(
        //         { username: body.username },
        //         { $push: { thoughts: createThought._id}},
        //         { new:true }
        //     )
        //     .select('-__v')

        //     if(!updateUSer){
        //         throw new Error(
        //             'Failed to update user!'
        //         )
        //     }
        //     res.json(createThought);
         }catch({ message }) {
            res.status(500).json({ message })
        }
    },

    getThoughtById({ params }, res ){
        Thought.findOne({ _id: params.thoughtId })
        .select('-__v')
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'Not able to find thoughts with that user id'})
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    },

    updateThought({ params, body }, res ){
        Thought.findOneAndUpdate(
            {_id: params.thoughtId },
            body,
            { new: true, runValidators: true}
        )
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'Update failed... No thought was found with that id'})
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err)
        })
    },

    deleteThought({ params }, res ){
        Thought.findOneAndDelete(
            {_id: params.thoughtId}
        ).then(dbThoughtData => {
            return User.findOneAndUpdate(
            { _id: dbThoughtData.userId}, 
            { $pull: {thoughts: dbThoughtData._id}},
            { new: true }
            )
        }) .then(dbUserData => res.json(dbUserData))
        // .then(dbThoughtData => {
        //     console.log(dbThoughtData)
        //     if(!dbThoughtData){
        //         res.status(404).json('Error no thought found to delete with that id')
        //         return;
        //     }
        //     User.findOneAndUpdate(
        //         { username: dbThoughtData.username },
        //         { $pull: { thoughts: params.thoughtId }},
        //         { new:true }
        //     )
        //     .select('-__v')
        //     .then(dbThoughtData => {
        //         if(!dbThoughtData){
        //             res.status(404).json({ message: 'User Update Faileddddddddd'})
        //             return;
        //         }
        //         res.json(dbThoughtData)
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         res.status(500).json(err)
        //     })
        // })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    },

    createReaction({ params, body }, res ){
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new:true, runValidators:true}
        )
        .select('-__v')
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'No Thought was found with that id'})
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    },

    deleteReaction({ params }, res ){
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            { $pull: { reactions: {_id: params.reactionId } } },
            { new:true }
        )
        .select('-__v')
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(500).json({ message: 'No thought found with that id'})
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    }
}
module.exports = thoughtController;