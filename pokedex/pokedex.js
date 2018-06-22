let search             = document.getElementById("search")
let searchQuery        = document.getElementById("search-query")
let pokemonName        = document.getElementById("pokemon-name")
let pokemonDescription = document.getElementById("pokemon-description")
let pokemonSprite      = document.getElementById("pokemon-sprite")
let pokemonState       = {
  name:        null,
  description: null,
  sprite:      null
}

function resetPokemonState() {
  pokemonState = {
    name:        null,
    description: null,
    sprite:      null
  }
}

function isStateComplete() {
  return    pokemonState.name        != null
         && pokemonState.description != null
         && pokemonState.sprite      != null
}

function findNameWithLanguage(language) {
  return names => names.find(name => name.language.name == language)
}

function findDescriptionWithLanguage(language) {
  return descriptions => {
    const versions = ["moon", "sun", "alpha-sapphire", "omega-ruby", "y", "x",
                      "white-2", "black-2", "xd", "colosseum", "white", "black",
                      "soulsilver", "heartgold", "platinum", "pearl", "diamond",
                      "leafgreen", "firered", "emerald", "sapphire", "ruby",
                      "crystal", "silver", "gold", "yellow", "blue", "red"]
    for(let i in versions) {
      let version     = versions[i]
      let description = descriptions.find(entry => entry.language.name == language && entry.version.name == version)
      if(description) {
        return description
      }
    }
  }
}

function get(url, successCallback, failureCallback=null) {
  // http://youmightnotneedjquery.com/#request
  let request = new XMLHttpRequest()
  request.open("GET", url, true)
  request.onload = function() {
    if(200 <= this.status && this.status < 400) {
      successCallback(this.response)
    }
    else {
      if(failureCallback) {
        failureCallback(this)
      }
    }
  }
  request.onerror = function() {
    if(failureCallback) {
      failureCallback(this)
    }
  }
  request.send()
}

function getJSON(url, successCallback, failureCallback=null) {
  get(url, response => successCallback(JSON.parse(response)), failureCallback)
}

function getResource(resource, callback) {
  getJSON(`https://pokeapi.co/api/v2/${resource}/`, callback)
}

function getPokemonGenericResource(id, callback) {
  getResource(`pokemon/${id}`, callback)
}

function getPokemonSpeciesResource(id, callback) {
  getResource(`pokemon-species/${id}`, callback)
}

function getPokemon(id) {
  resetPokemonState()
  getPokemonGenericResource(id, pokemon => {
    pokemonState.sprite = pokemon.sprites.front_default
    if(isStateComplete()) {
      showPokemon(pokemonState)
    }
  })
  getPokemonSpeciesResource(id, pokemon => {
    pokemonState.name        = findNameWithLanguage("en")(pokemon.names).name
    pokemonState.description = findDescriptionWithLanguage("en")(pokemon.flavor_text_entries).flavor_text
    if(isStateComplete()) {
      showPokemon(pokemonState)
    }
  })
}

function showPokemon(pokemon) {
  pokemonName.textContent        = pokemon.name
  pokemonDescription.textContent = pokemon.description
  pokemonSprite.src              = pokemon.sprite
}

search.addEventListener("submit", event => {
  event.preventDefault();
  getPokemon(searchQuery.value.trim().toLowerCase())
})
