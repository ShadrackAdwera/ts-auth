import { Schema, Document, Model, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface UserDoc extends Document {
    username: string;
    email: string;
    password: string;
    version: number;
}

interface UserModel extends Model<UserDoc> {
    username: string;
    email: string;
    password: string;
}

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, min: 6 }
}, { timestamps: true, toJSON: { getters: true } });

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

const User = model<UserDoc, UserModel>('User', userSchema);

export { User };