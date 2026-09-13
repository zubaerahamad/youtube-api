import {Schema, model} from 'mongoose';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        avatar: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
            required: true,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Video',
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next): Promise<void> {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSaltSync(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (password: "string"): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,

        },
        process.env.JWT_ACCESS_TOKEN,
        {expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY}
    );
};

userSchema.methods.generateRefreshToken = function (): string {
    return jwt.sign(
        {id: this._id},
        process.env.JWT_REFRESH_TOKEN,
        {expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY}
    );
};

export const User = model('User', userSchema);