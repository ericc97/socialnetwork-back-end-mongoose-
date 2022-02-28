const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


const ReactionSchema = new Schema( 
    {
        reactionBody: {
            type: String,
            required: 'Reaction body is required',
            trim: true,
            maxLength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt:{
            type: Date,
            default: Date.now,
            get: (createdVal) => dateFormat(createdVal)
        }
    },
    {
        toJSON: {
            getters: true
        },
        id: false
    }
);


const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            require: true,
            maxLength: 280,
            minLength: 1,
            trim:true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdVal) => dateFormat(createdVal) 
        },
        username: {
            type: String,
            required: true
        },
        reactions: [ReactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
    
);

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;