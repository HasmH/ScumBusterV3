import express, { application } from 'express'
import { getPlayerSteamIdFromVanityUrl, getPlayerSummaries } from './steam-api'
import { SqlDb } from './db/db'
const app = express()
const db = new SqlDb('sqlite::memory:')

//Steam API + wrangling it for Business Logic goes here + any db orm logic

app.get('/', (req, res) => {
    res.send(db.testConnection())
    res.send(db.getAllUsers())
})

/**
 * @params - list of steamIds 
 * @returns - SteamUser Information given a steamId or comma seperated list of steamIds
 */

app.get('/user/steamId/:steamIds', async (req, res) => {
    const steamIds = req.params.steamIds
    const playerData = await getPlayerSummaries(steamIds)
    res.send(playerData)
})

/**
 * @params - vanity URL (whatever comes after /id/XXXX for custom URLs users set)
 * @returns - SteamUser Information given a Display Name 
 */
app.get('/user/customUrlSteamId/:vanityUrl', async (req, res) => {
    const vanityUrl = req.params.vanityUrl
    const playerSteamId = await getPlayerSteamIdFromVanityUrl(vanityUrl)
    res.send(playerSteamId)

})

/**
 * @params - userSuppliedUrl - the url the user will give to report a player either in custom URL format or default URL format i.e.
 * If it is a custom (vanity) url it will look something like - https://steamcommunity.com/id/SOME_CUSTOM_NAME
 * If it is a default url it will look something like - https://steamcommunity.com/profiles/76561198795577738
 * @returns - SteamUser information 
 */
app.get('/user/steamId/find/:userSuppliedUrl', async (req, res) => {
    const userSuppliedUrl =  decodeURIComponent(req.params.userSuppliedUrl)
    //TODO: Some logic here to accept comma seperated list of URLs and iterate through blah blah
    //TODO: User Supplied url in frontend should send it URL encoded
    try {
        const urlObject = new URL(userSuppliedUrl);
        if (urlObject.pathname.includes("profiles/")) {
          const parts = urlObject.pathname.split("/");
          const defaultSteamId = parts[2];
          const playerData = await getPlayerSummaries(defaultSteamId)
          res.send(playerData)
        } else if (urlObject.pathname.includes("id/")) {
          const parts = urlObject.pathname.split("/");
          const customVanityUrl =  parts[2];
          const playerSteamId = await getPlayerSteamIdFromVanityUrl(customVanityUrl)
          if (!playerSteamId) {
            throw new Error('No Steam Id Was Found with that custom vanity url')
          }
          const playerData = await getPlayerSummaries(playerSteamId.toString())
          res.send(playerData)
        }
      } catch (error) {
        console.error(error)
        throw new Error('Invalid URL Supplied')
      }
})

app.post('/user/create/:steamId', async (req, res) => {
    
})

app.listen(4321, () => {
    console.log('Running on 4321')
    console.log('Initialising DB...')

})

//If Vanity URL (custom url) steam.../id/customname #1
//If default steam.../profiles/712312321312 #2
//User will supply the URL looking like either 
//User experience: 
//Enter a URL You want to Report
//Backend gets steamid, avatar etc --> construct a simple page out of it 
//Save against backend the following schema:
//This is MVP
//{steamId: number, downvotes: number }