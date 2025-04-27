const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  tempUserData: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("Verification", verificationSchema);
