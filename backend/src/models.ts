import  mongoose, { Schema }  from 'mongoose'
import 'dotenv/config'
import { getConnectionString } from './env'

const user = encodeURIComponent(process.env.MONGO_USER ?? '')
const pw = encodeURIComponent(process.env.MONGO_PW ?? '')
mongoose.connect(getConnectionString(user, pw))

const UserSchema = new Schema({
    steamid: {
      type: String,
      required: true,
      unique: true,
    },
    downvotes: {
      type: Number,
      required: true,
    },
});

export const User = mongoose.model('User', UserSchema);