import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TagSchema = new Schema(
  {
    name: { type: String, required: true },
    perVisit: { type: Boolean, required: true },
    description: { type: String },
  },
);

export default mongoose.model('Tag', TagSchema);
