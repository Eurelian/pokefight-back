const Game = require('../database/models/Game')
const Player = require('../database/models/Player')

exports.find_all = async (req, res) => {
    const allGames = await Game.find().populate('player', '_id username email')
    res.json(allGames)
}

exports.get_ranking = async (req, res) => {
    const allPlayers = await Player.find().populate('games')
    const result = allPlayers.map(p => {
        return {
            name: p.username,
            gamesPlayed: p.games ? p.games.length : 0,
            gamesWon: p.games ? p.games.reduce((acc, curr) => curr.winner === true ? acc + 1 : acc, 0) : 'None',
            gamesLost: p.games ? p.games.reduce((acc, curr) => curr.winner === false ? acc + 1 : acc, 0) : 'None',
        }
    })
    result.sort((a, b) => b.gamesWon - a.gamesWon);
    result.forEach((r, i) => {
        r.rank = i + 1
    })
    res.json(result)
}

exports.create_one = async (req, res) => {
    const { player, chosenPokemonId, adversaryPokemonId, winner } = req.body
    if (!player || !chosenPokemonId || !adversaryPokemonId || typeof winner !== 'boolean') return res.status(400).send('Missing information to save a game')

    let newGame = new Game({
        player,
        chosenPokemonId,
        adversaryPokemonId,
        winner
    })

    try {
        await newGame.save()
        await Player.findByIdAndUpdate(player, { $push: { games: newGame._id } })
    } catch (err) {
        console.error(err)
    }

    res.json(newGame)
}