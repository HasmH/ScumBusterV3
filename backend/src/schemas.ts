import { z } from "zod";

//Schemas and Types go here
const SteamUserSchema = z.object({
    steamid: z.string(),
    personaname: z.string(),
    profileurl: z.string(),
    avatar: z.string(),
    timecreated: z.number(),
    downvotes: z.number(),
})


type SteamUser = z.infer<typeof SteamUserSchema>

export {
    SteamUser, 
    SteamUserSchema
}
