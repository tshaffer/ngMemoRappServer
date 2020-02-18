import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TaggedEntityRatingSchema = new Schema(
  {
    tagId: { type: String, required: true },
    tagTargetId: { type: String, required: true },    // for a menu item, the target id is a restaurant review id
    rating: { type: Number, required: true },
    comments: { type: String },
  },
);

export default mongoose.model('TaggedEntityRating', TaggedEntityRatingSchema);
