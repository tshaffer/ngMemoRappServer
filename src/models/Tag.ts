import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TagSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true }, // boolean - existence or not; number - gets a numeric rating; future (enum)
    perVisit: { type: Boolean, required: true },
    description: { type: String },
  },
);

export default mongoose.model('Tag', TagSchema);
