import { z } from "zod";

//Schemas and Types go here
const SteamUserSchema = z.object({
    steamid: z.string(),
    personaname: z.string(),
    profileurl: z.string(),
    avatar: z.string(),
    timecreated: z.number()
})

const MongoUserSchema = z.object({
    steamid: z.string(),
    downvotes: z.number().default(0)
})

const SteamUserListSchema = z.array(SteamUserSchema)


type SteamUserListType = z.infer<typeof SteamUserListSchema>
type UserType = z.infer<typeof MongoUserSchema>

export {
    SteamUserListType, 
    SteamUserListSchema,
    UserType
}
