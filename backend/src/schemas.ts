import { z } from "zod";

//Schemas and Types go here

const SteamUserSchema = z.object({
    steamid: z.string(),
    personaname: z.string(),
    profileurl: z.string(),
    avatar: z.string(),
    timecreated: z.number()
})

type SteamUserType = z.infer<typeof SteamUserSchema>

export {
    SteamUserSchema, 
    SteamUserType
}
