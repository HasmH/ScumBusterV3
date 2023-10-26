import { z } from "zod";

//Schemas and Types go here
const SteamUserSchema = z.object({
    steamid: z.string(),
    personaname: z.string(),
    profileurl: z.string(),
    avatar: z.string(),
    timecreated: z.number()
})

const SteamUserListSchema = z.array(SteamUserSchema)


type SteamUserListType = z.infer<typeof SteamUserListSchema>

export {
    SteamUserListType, 
    SteamUserListSchema
}
