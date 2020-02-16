import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    tags: [Number],
  },
);

export default mongoose.model('User', UserSchema);
