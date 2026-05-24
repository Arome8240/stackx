import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookmarkDocument = HydratedDocument<Bookmark>;

@Schema({ timestamps: true, collection: 'bookmarks' })
export class Bookmark {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Cast', required: true, index: true })
  cast: Types.ObjectId;
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);
BookmarkSchema.index({ user: 1, cast: 1 }, { unique: true });
BookmarkSchema.index({ user: 1, createdAt: -1 });
