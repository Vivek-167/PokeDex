/**
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 * @param {Object} context
 * @returns {Object} object - API Gateway Lambda Proxy Output Format 
 */

const request = require('request');
let response;
function getPokedex() {
    return new Promise(resolve => {
        let totalPokemons = 5;
        let pokemon = [];
        let averages = [
            { name: 'hp', stat: 0 },
            { name: 'attack', stat: 0 },
            { name: 'defense', stat: 0 },
            { name: 'special-attack', stat: 0 },
            { name: 'special-defense', stat: 0 },
            { name: 'speed', stat: 0 }
        ];
        for (let x = 1; x<=totalPokemons; x++) {
            request.get(`https://pokeapi.co/api/v2/pokemon/${x}`,{JSON: true}, (err, res, body) => {
                if (err) return console.log(err);
                let pokemonData = JSON.parse(body);
                let pokemonStats = [];
                for (let i = 0 ; i<pokemonData.stats.length; i++) {
                    pokemonStats.push({
                        "name": pokemonData.stats[i].stat.name,
                        "stat": pokemonData.stats[i].base_stat
                    });
                    averages[i].stat+=pokemonData.stats[i].base_stat;
                }
                pokemon.push({
                    "name": pokemonData.name,
                    "stats": pokemonStats
                })
                if (pokemon.length == totalPokemons) {
                    for (let i = 0; i<averages.length; i++)
                    averages[i].stat/=totalPokemons;
                    pokemon.sort(function(a, b){return a.name.localeCompare(b.name)});
                    resolve({
                        "statusCode": 200,
                        "headers":{"Content-Type": "application/json"},
                        "body": {
                            "pokemon": pokemon,
                            "averages": averages
                        }
                    })
                }
            })
        }
    })
}

exports.lambdaHandler = async (event, context) => {
    try {
        response = await getPokedex();
        console.log("result", response);
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
};
