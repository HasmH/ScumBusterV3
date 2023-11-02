import axios from 'axios'
import { SteamUserSchema, SteamUser } from './schemas'
import 'dotenv/config'
import { User } from './models'

//Steam API fetching goes here

const steamApiEndpoint = (interfaceName: string, method: string, version: string): string => {
    const endpoint = `http://api.steampowered.com/${interfaceName}/${method}/${version}/?key=${process.env.STEAM_API_KEY}`
    return endpoint
}

const getPlayerSummaries = async (steamId: string): Promise<SteamUser | string> => {
    const endpoint = steamApiEndpoint('ISteamUser', 'GetPlayerSummaries', 'v0002') + `&steamids=${steamId}`
    try {
        //If Existing User, do not call Steam API
        const existingUser = await User.findOne({steamid: steamId})
        if (existingUser) {
            return SteamUserSchema.parse(existingUser)
        }

        //If new User, call Steam API, and create them in database
        const res = await axios.get(endpoint)
        if (!res){
            console.error(res)
            throw new Error('Some error to do with Steam API')
        }
        let playerData = res.data.response.players[0]
        if (playerData.length === 0) {
            return `No profile was found with steam id ${steamId}`
        }
        const newUser = new User({steamid: steamId, 
            personaname: playerData.personaname, 
            profileurl: playerData.profileurl,
            avatar: playerData.avatar,
            timecreated: playerData.timecreated, 
            downvotes: 0
        })
        await newUser.save()
        return SteamUserSchema.parse(newUser)
    } catch (error) {
        console.error(error)
        return `No profile was found with steam id ${steamId}`
    }
}

const getPlayerSteamIdFromVanityUrl = async (vanityUrl: string): Promise<number | string> => {
    const endpoint = steamApiEndpoint('ISteamUser', 'ResolveVanityURL', 'v0001') + `&vanityurl=${vanityUrl}`
    try {
        const res = await axios.get(endpoint)
        if (!res) {
            throw new Error('Some error')
        }
        if (res.data.response.message === 'No match') {
            return `No profile was found with vanity url ${vanityUrl}`
        }
        const steamId: number = res.data.response.steamid
        return steamId
    } catch (error) {
        console.error(error)
        return `No profile was found with vanity url ${vanityUrl}`
    }
}

export { getPlayerSummaries, getPlayerSteamIdFromVanityUrl }