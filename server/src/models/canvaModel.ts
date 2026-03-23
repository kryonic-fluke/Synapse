import { model, Schema } from "mongoose";

const canvasSchema = new Schema({
  name: { type: String, required: true, default: "Untitled Canvas" },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
,
  collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],  
  inviteToken: { type: String, unique: true }
}, {timestamps: true });



export const Canvas = model('Canvas', canvasSchema);
