import express, { application } from 'express'
import { getPlayerSteamIdFromVanityUrl, getPlayerSummaries } from './steam-api'
import { User } from './models'
import { SteamUserSchema } from './schemas'

const app = express()
//Steam API + wrangling it for Business Logic goes here + any db orm logic

/**
 * @params - userSuppliedUrl - the url the user will give to report a player either in custom URL format or default URL format i.e.
 * If it is a custom (vanity) url it will look something like - https://steamcommunity.com/id/SOME_CUSTOM_NAME
 * If it is a default url it will look something like - https://steamcommunity.com/profiles/76561198795577738
 * @returns - SteamUser information 
 */
app.get('/user/steamId/find/:listofUserSuppliedUrls', async (req, res) => {
    const listofUserSuppliedUrls =  decodeURIComponent(req.params.listofUserSuppliedUrls).split(',').filter((a) => a && a.trim())
    //TODO: User Supplied URL should be regex'ed to be https://steamcommunity.com/id/* or https://steamcommmunity.com/profiles/* - remove from list if not
    //TODO: User Supplied url in frontend should send it URL encoded
    const results = await Promise.all( 
      listofUserSuppliedUrls.map(async (userSuppliedUrl) => {
          try {
              const urlObject = new URL(userSuppliedUrl)
              if (urlObject.pathname.includes("profiles/")) {
                  const parts = urlObject.pathname.split("/")
                  const defaultSteamId = parts[2]
                  const playerData = await getPlayerSummaries(defaultSteamId)
                  if (typeof playerData === 'string') {
                    return `No profile was found with steam id ${defaultSteamId}`
                  }
                  return playerData
              } else if (urlObject.pathname.includes("id/")) {
                  const parts = urlObject.pathname.split("/")
                  const customVanityUrl =  parts[2]
                  const playerSteamId = await getPlayerSteamIdFromVanityUrl(customVanityUrl)
                  const playerData = await getPlayerSummaries(playerSteamId.toString())
                  return playerData 
              }
          } catch (error) {
              console.error(error)
              //TODO: Catch error types here
              throw new Error('Invalid URL Supplied')
          }
      })
  )
  res.send(results)
})

app.post('/user/downvote/:steamId', async (req, res) => {
    const newUserSteamId = req.params.steamId
    const existingUser = await User.findOne({steamid: newUserSteamId})
    if (existingUser) {
      await User.updateOne({ steamid: newUserSteamId }, { $inc: { downvotes: 1 } });
      const updatedUser = await User.findOne({ steamid: newUserSteamId });
      res.send(SteamUserSchema.parse(updatedUser));
  } else {
      let playerData = await getPlayerSummaries(newUserSteamId)
      const newUser = new User(playerData).set('downvotes', 1)
      await newUser.save()
      res.send(SteamUserSchema.parse(newUser))
    }
})


app.listen(4321, () => {
    console.log('Running on 4321')
    console.log('Initialising DB...')
})

// MVP:
  // 1. User can enter steam profile URL (s) and it will return the steam user information (/user/steamId/find/:userSuppliedUrl)
  // 2. Results page - frontend will display the steam user information and allow the user to report the player
    // 2.1 - Check if the User Exists in the database, if so, display downvotes
  // 3. On dowvote - the user will be added to the database and the downvote count will be incremented
    // 3.1 - If the user already exists in the database, the downvote count will be incremented
  

//TODO:
  // - Testing
  // - Error Handling
  // - Status Codes 