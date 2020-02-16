import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TagInstanceSchema = new Schema(
  {
    tagId: { type: String, required: true },
    tagTargetId: { type: String, required: true },
    rating: { type: Number, required: true },
    comments: { type: String },
  },
);

export default mongoose.model('TagInstance', TagInstanceSchema);
