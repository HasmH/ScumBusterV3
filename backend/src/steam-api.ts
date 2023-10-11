import axios from 'axios'
import 'dotenv/config'

const steamApiEndpoint = (interfaceName: string, method: string, version: string): string => {
    const endpoint = `http://api.steampowered.com/${interfaceName}/${method}/${version}/?key=${process.env.STEAM_API_KEY}`
    return endpoint
}

const getPlayerSummaries = async () => {
    const endpoint = steamApiEndpoint('ISteamUser', 'GetPlayerSummaries', 'v0002') + '&steamids=76561199256222390'
    try {
        const res = await axios.get(endpoint)
        const playerData = res.data
        return playerData
    } catch (error) {
        console.error(error)
    }
}

export { getPlayerSummaries }