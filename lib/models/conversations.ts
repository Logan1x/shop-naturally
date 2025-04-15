import mongoose, { Document, Model, Schema } from "mongoose";

export interface IConversation extends Document {
  userMsg: string;
  filters: any;
  effectiveFilters: any;
  createdAt: Date;
}

const conversationSchema = new Schema<IConversation>({
  userMsg: { type: String, required: true },
  filters: { type: Schema.Types.Mixed, default: {} },
  effectiveFilters: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
});

const Conversations: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", conversationSchema);

export default Conversations;
