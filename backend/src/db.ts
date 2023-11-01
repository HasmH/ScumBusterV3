import  mongoose, { Schema }  from 'mongoose'
import 'dotenv/config'
import { UserType } from './schemas'
import { getConnectionString } from './env'
class UserDB {
    user: string
    pw: string
    uri: string
    UserSchema: Schema
    User: any
    constructor() {
        this.user = encodeURIComponent(process.env.MONGO_USER ?? '')
        this.pw = encodeURIComponent(process.env.MONGO_PW ?? '')
        this.uri = getConnectionString(this.user, this.pw)   
        mongoose.connect(this.uri)

        //Initialize User Schema
        this.UserSchema = new Schema({
            steamid: String,
            downvotes: Number
        })
    }

    public async createUser(user: UserType) {
        const UserModel = mongoose.model('User', this.UserSchema)
        const newUser = new UserModel(user)
        await newUser.save()
    }

    
}

export {
    UserDB
}