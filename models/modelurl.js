import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  redirectURL: {
    type: String,
    required: true,
  },
});

const URL = mongoose.model('discord-links', urlSchema);

export { URL };
