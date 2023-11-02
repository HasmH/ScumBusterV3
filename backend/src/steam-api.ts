import axios from 'axios'
import { SteamUserListSchema, SteamUserListType } from './schemas'
import 'dotenv/config'

//Steam API fetching goes here

const steamApiEndpoint = (interfaceName: string, method: string, version: string): string => {
    const endpoint = `http://api.steampowered.com/${interfaceName}/${method}/${version}/?key=${process.env.STEAM_API_KEY}`
    return endpoint
}

const getPlayerSummaries = async (steamIds: string): Promise<SteamUserListType | string> => {
    const endpoint = steamApiEndpoint('ISteamUser', 'GetPlayerSummaries', 'v0002') + `&steamids=${steamIds}`
    try {
        const res = await axios.get(endpoint)
        if (!res){
            console.error(res)
            throw new Error('Some error to do with Steam API')
        }
        const playerData = res.data.response.players
        if (playerData.length === 0) {
            return `No profile was found with steam id ${steamIds}`
        }
        return SteamUserListSchema.parse(playerData)
    } catch (error) {
        console.error(error)
        return `No profile was found with steam id ${steamIds}`
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