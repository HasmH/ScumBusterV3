import axios from 'axios'
import { SteamUserSchema, SteamUserType } from './schemas'
import 'dotenv/config'

//Steam API fetching goes here

const steamApiEndpoint = (interfaceName: string, method: string, version: string): string => {
    const endpoint = `http://api.steampowered.com/${interfaceName}/${method}/${version}/?key=${process.env.STEAM_API_KEY}`
    return endpoint
}

const getPlayerSummaries = async (steamIds: string): Promise<SteamUserType | null> => {
    const endpoint = steamApiEndpoint('ISteamUser', 'GetPlayerSummaries', 'v0002') + `&steamids=${steamIds}`
    try {
        const res = await axios.get(endpoint)
        if (!res){
            throw new Error('Some error')
        }
        const playerData: SteamUserType = res.data.response.players[0]
        SteamUserSchema.parse(playerData)
        return playerData
    } catch (error) {
        console.error(error)
        return null
    }
}

export { getPlayerSummaries }