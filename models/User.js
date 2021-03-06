
let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

//schema
let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        match: [/^.{4, 12}$/, 'Should be 4-12 characters!'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        select: false
    },
    name: {
        type:String,
        trim: true,
        required:[true, 'Name is required!']
    },
    email: {
        type:String,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Should be a valid email address!'],
        trim: true
    }
}, {
    toObject:{virtuals:true}
});

//virtuals
// 필요한 항목이지만, DB에 저장될 필요가 없으면 => virtual 처리
userSchema.virtual('passwordConfirmation').get(function() {
    return this._passwordConfirmation;
}).set(function(value) {
    this._passwordConfirmation = value;
});

userSchema.virtual('originalPassword').get(function() {
    return this._originalPassword;
}).set(function(value) {
    this._originalPassword = value;
});

userSchema.virtual('currentPassword').get(function() {
    return this._currentPassword;
}).set(function(value) {
    this._currentPassword = value;
});

userSchema.virtual('newPassword').get(function() {
    return this._newPassword;
}).set(function(value) {
    this._newPassword = value;
});

//password validation
let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
let passwordRegexErrorMessage = 'Should be minimum 8 characters of alphabet and number combination!';

userSchema.path('password').validate(function(v) {
    let user = this;

    // create user
    if (user.isNew) {
        if (!user._passwordConfirmation) {
            user.invalidate('passwordConfirmation', 'Password Confirmation is required.');
        }

        if (!passwordRegex.test(user.password)) {
            user.invalidate('password', passwordRegexErrorMessage);
        }else if(user.password !== user.passwordConfirmation) {
            user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
        }
    }

    if (!user.isNew) {
        if (!user.currentPassword) {
            user.invalidate('currentPassword', 'Current Password is required!');
        }else if (!bcrypt.compareSync(user.currentPassword != user.originalPassword)) {
            user.invalidate('currentPassword', 'Current Password is invalid!');
        }

        if (user._newPassword && !passwordRegex.test(user._newPassword)) {
            user.invalidate('newPassword', passwordRegexErrorMessage);
        }else if (user._newPassword != user.passwordConfirmation) {
            user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
        }
    }
});

userSchema.pre('save', function (next) {
    let user = this;
    if(!user.isModified('password')) {
        return next;
    } else {
        user.password = bcrypt.hashSync(user.password);
        return next();
    }
});

userSchema.methods.authenticate = function(password) {
    let user = this;
    return bcrypt.compareSync(password, user.password);
};

let User = mongoose.model('user', userSchema);
module.exports = User;