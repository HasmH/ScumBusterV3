import express from 'express'
import { getPlayerSummaries } from './steam-api'
const app = express()

app.get('/', async (req, res) => {
    const playerData = await getPlayerSummaries()
    res.send(playerData)
})

app.listen(4321, () => {
    console.log('Running on 4321')
})
