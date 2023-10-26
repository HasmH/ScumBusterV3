import axios from 'axios'
import { SteamUserListSchema, SteamUserListType } from './schemas'
import 'dotenv/config'

//Steam API fetching goes here

const steamApiEndpoint = (interfaceName: string, method: string, version: string): string => {
    const endpoint = `http://api.steampowered.com/${interfaceName}/${method}/${version}/?key=${process.env.STEAM_API_KEY}`
    return endpoint
}

const getPlayerSummaries = async (steamIds: string): Promise<SteamUserListType | null> => {
    const endpoint = steamApiEndpoint('ISteamUser', 'GetPlayerSummaries', 'v0002') + `&steamids=${steamIds}`
    try {
        const res = await axios.get(endpoint)
        if (!res){
            throw new Error('Some error')
        }
        const playerData: SteamUserListType = res.data.response.players
        return SteamUserListSchema.parse(playerData)
    } catch (error) {
        console.error(error)
        return null
    }
}

const getPlayerSteamIdFromVanityUrl = async (vanityUrl: string): Promise<number | null> => {
    const endpoint = steamApiEndpoint('ISteamUser', 'ResolveVanityURL', 'v0001') + `&vanityurl=${vanityUrl}`
    try {
        const res = await axios.get(endpoint)
        if (!res) {
            throw new Error('Some error')
        }
        const steamId: number = res.data.response.steamid
        return steamId
    } catch (error) {
        console.error(error)
        return null 
    }
}

export { getPlayerSummaries, getPlayerSteamIdFromVanityUrl }