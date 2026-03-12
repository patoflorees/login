var allPokemons = [];
var seleccionados = [];

var p1 = null;
var p2 = null;

var turnoNumero = 1;

fetch("https://pokeapi.co/api/v2/pokemon?limit=150")
.then(res => res.json())
.then(data => {

var promises = [];

for (var i = 0; i < data.results.length; i++) {
promises.push(fetch(data.results[i].url).then(r => r.json()));
}

Promise.all(promises).then(function(pokemonData){

allPokemons = pokemonData;
mostrarPokemones(allPokemons);

});

});

function mostrarPokemones(lista){

var container = document.getElementById("pokemonContainer");
container.innerHTML = "";

for(var i=0;i<lista.length;i++){

var card = "<div class='pokemon-card'>";

card += "<img src='"+lista[i].sprites.front_default+"'>";
card += "<h3>"+lista[i].name+"</h3>";
card += "<button onclick='seleccionar("+lista[i].id+")'>Elegir</button>";

card += "</div>";

container.innerHTML += card;

}

}

function seleccionar(id){

if(seleccionados.length >= 2){
alert("Ya seleccionaste 2 Pokémon");
return;
}

fetch("https://pokeapi.co/api/v2/pokemon/"+id)
.then(res=>res.json())
.then(function(data){

var pokemon = prepararPokemon(data);

if(seleccionados.length === 0){

p1 = pokemon;
mostrarPokemon(p1,"p1");

document.getElementById("battleLog").textContent =
"Primer Pokémon seleccionado: " + p1.name;

}

else{

p2 = pokemon;
mostrarPokemon(p2,"p2");

document.getElementById("battleLog").textContent =
"Segundo Pokémon seleccionado: " + p2.name + ". ¡La batalla comienza!";

setTimeout(pelea,1000);

}

seleccionados.push(id);

});

}

function prepararPokemon(data){

var stats = {};

for(var i=0;i<data.stats.length;i++){
stats[data.stats[i].stat.name] = data.stats[i].base_stat;
}

return {

name:data.name,
img:data.sprites.front_default,

attack:stats.attack,
defense:stats.defense,
spatk:stats["special-attack"],
spdef:stats["special-defense"],

turnos:0,
defensaActiva:false

};

}

function mostrarPokemon(p,prefix){

document.getElementById(prefix+"Name").textContent = p.name;
document.getElementById(prefix+"Img").src = p.img;

document.getElementById(prefix+"Stats").innerHTML =

"<li>Ataque: "+p.attack+"</li>"+
"<li>Defensa: "+p.defense+"</li>"+
"<li>Ataque especial: "+p.spatk+"</li>"+
"<li>Defensa especial: "+p.spdef+"</li>";

}

function pelea(){

var hp1 = 100;
var hp2 = 100;

var log = document.getElementById("battleLog");

var intervalo = setInterval(function(){

var atacante = Math.random() < 0.5 ? 1 : 2;

var texto = "";
var daño = 0;

var pokemonAtaca = atacante === 1 ? p1 : p2;
var pokemonDefiende = atacante === 1 ? p2 : p1;

pokemonAtaca.turnos++;

var vidaDefensor = atacante === 1 ? hp2 : hp1;

/* FALLAR ATAQUE */

if(Math.random() < 0.15){

texto =
"Turno " + turnoNumero + ": " +
pokemonAtaca.name + " intenta atacar pero FALLA.";

}

/* DEFENSA ESPECIAL */

else if(pokemonAtaca.turnos >= 2 && Math.random() < 0.2){

pokemonAtaca.defensaActiva = true;

texto =
"Turno " + turnoNumero + ": " +
pokemonAtaca.name + " usa DEFENSA ESPECIAL.";

}

/* ATAQUE ESPECIAL */

else if(pokemonAtaca.turnos >= 3 && Math.random() < 0.3){

daño = Math.floor((pokemonAtaca.spatk - pokemonDefiende.spdef/2)/5);
if(daño < 1) daño = 1;

if(pokemonDefiende.defensaActiva){

daño = Math.floor(daño/2);

texto =
"Turno " + turnoNumero + ": " +
pokemonAtaca.name + " usa ATAQUE ESPECIAL pero "
+ pokemonDefiende.name + " se defendió y recibe "
+ daño + " de daño.";

pokemonDefiende.defensaActiva = false;

}else{

texto =
"Turno " + turnoNumero + ": " +
pokemonAtaca.name + " usa ATAQUE ESPECIAL y hace "
+ daño + " de daño.";

}

}

/* ATAQUE NORMAL */

else{

daño = Math.floor((pokemonAtaca.attack - pokemonDefiende.defense/2)/5);
if(daño < 1) daño = 1;

if(pokemonDefiende.defensaActiva){

daño = Math.floor(daño/2);

texto =
"Turno " + turnoNumero + ": " +
pokemonAtaca.name + " ataca pero "
+ pokemonDefiende.name + " se defendió y recibe "
+ daño + " de daño.";

pokemonDefiende.defensaActiva = false;

}else{

texto =
"Turno " + turnoNumero + ": " +
pokemonAtaca.name + " usa ATAQUE y hace "
+ daño + " de daño.";

}

}

/* APLICAR DAÑO */

if(atacante === 1){

hp2 -= daño;
if(hp2 < 0) hp2 = 0;

vidaDefensor = hp2;

}else{

hp1 -= daño;
if(hp1 < 0) hp1 = 0;

vidaDefensor = hp1;

}

document.getElementById("p1Hp").textContent = hp1;
document.getElementById("p2Hp").textContent = hp2;

texto += " Vida restante de " + pokemonDefiende.name + ": " + vidaDefensor + "%";

log.textContent = texto;

/* GANADOR */

if(hp1 <= 0 || hp2 <= 0){

clearInterval(intervalo);

var ganador = hp1 > hp2 ? p1 : p2;

mostrarGanador(ganador);

}

turnoNumero++;

},2000);

}

function mostrarGanador(pokemon){

var winnerArea = document.getElementById("winnerArea");

winnerArea.innerHTML =

"<h2>GANADOR</h2>" +
"<h3>"+pokemon.name+"</h3>" +
"<img src='"+pokemon.img+"' width='200'>" +
"<br><br>" +
"<button onclick='location.reload()'>Hacer otra batalla</button>";

}
