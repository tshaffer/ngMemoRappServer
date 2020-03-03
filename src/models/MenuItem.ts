import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MenuItemSchema = new Schema(
  {
    menuItemName: { type: String, required: true },
    description: { type: String },
  },
);

export default mongoose.model('MenuItem', MenuItemSchema);
