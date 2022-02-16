const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};


const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdVal => dateFormat(createdVal)
        },
        email:{ 
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
        
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);

// get total amount of friends 
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

// create User model using UserSchema
const User = model('User', UserSchema);

// exports the User model
module.exports = User;