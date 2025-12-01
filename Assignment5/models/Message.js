import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  encryptedData: {
    cipherText: { type: String, required: true },   // AES Encrypted Content
    nonce: { type: String, required: true },        // AES IV
    kemCipherText: { type: String, required: true } // Kyber Encapsulated Key
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
