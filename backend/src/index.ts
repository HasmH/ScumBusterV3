import express from 'express'
import { getPlayerSummaries } from './steam-api'
const app = express()

//Steam API + wrangling it for Business Logic goes here + any db orm logic

app.get('/', (req, res) => {
    res.send('Hello')
})

/**
 * @returns - SteamUser Information given a steamId
 */

app.get('/user/:steamId', async (req, res) => {
    const steamId = req.params.steamId
    const playerData = await getPlayerSummaries(steamId)
    res.send(playerData)
})

/**
 * @params - Display Name
 * @returns - SteamUser Information given a Display Name 
 */
app.get('/user/:displayName', async (req, res) => {
    const displayName = req.params.displayName
})

app.listen(4321, () => {
    console.log('Running on 4321')
})
