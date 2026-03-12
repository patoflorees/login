var allPokemons = [];
var seleccionados = [];

var p1 = null;
var p2 = null;

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

defensaActiva:false

};

}

function mostrarPokemon(p,prefix){

document.getElementById(prefix+"Name").textContent = p.name;
document.getElementById(prefix+"Img").src = p.img;

document.getElementById(prefix+"Stats").innerHTML =

"<li>Attack: "+p.attack+"</li>"+
"<li>Defense: "+p.defense+"</li>"+
"<li>Sp.Attack: "+p.spatk+"</li>"+
"<li>Sp.Defense: "+p.spdef+"</li>";

}

function pelea(){

var hp1 = 100;
var hp2 = 100;

var log = document.getElementById("battleLog");

var turno = setInterval(function(){

var atacante = Math.random() < 0.5 ? 1 : 2;
var accion = Math.random();

var texto = "";
var daño = 0;

if(atacante === 1){

if(accion < 0.25){

p1.defensaActiva = true;

texto = p1.name + " usa DEFENSA ESPECIAL y se protege del siguiente ataque";

}

else if(accion < 0.5){

daño = Math.floor((p1.spatk - p2.spdef/2) / 5);
if(daño < 1) daño = 1;

if(p2.defensaActiva){

daño = Math.floor(daño / 2);

texto = p1.name + " usa ATAQUE ESPECIAL pero "
+ p2.name + " se defendió y solo recibe "
+ daño + " de daño";

p2.defensaActiva = false;

}else{

texto = p1.name + " usa ATAQUE ESPECIAL y hace "
+ daño + " de daño";

}

hp2 -= daño;

}

else{

daño = Math.floor((p1.attack - p2.defense/2) / 5);
if(daño < 1) daño = 1;

if(p2.defensaActiva){

daño = Math.floor(daño / 2);

texto = p1.name + " ataca pero "
+ p2.name + " se defendió y solo recibe "
+ daño + " de daño";

p2.defensaActiva = false;

}else{

texto = p1.name + " ataca y hace "
+ daño + " de daño";

}

hp2 -= daño;

}

}

else{

if(accion < 0.25){

p2.defensaActiva = true;

texto = p2.name + " usa DEFENSA ESPECIAL y se protege del siguiente ataque";

}

else if(accion < 0.5){

daño = Math.floor((p2.spatk - p1.spdef/2) / 5);
if(daño < 1) daño = 1;

if(p1.defensaActiva){

daño = Math.floor(daño / 2);

texto = p2.name + " usa ATAQUE ESPECIAL pero "
+ p1.name + " se defendió y solo recibe "
+ daño + " de daño";

p1.defensaActiva = false;

}else{

texto = p2.name + " usa ATAQUE ESPECIAL y hace "
+ daño + " de daño";

}

hp1 -= daño;

}

else{

daño = Math.floor((p2.attack - p1.defense/2) / 5);
if(daño < 1) daño = 1;

if(p1.defensaActiva){

daño = Math.floor(daño / 2);

texto = p2.name + " ataca pero "
+ p1.name + " se defendió y solo recibe "
+ daño + " de daño";

p1.defensaActiva = false;

}else{

texto = p2.name + " ataca y hace "
+ daño + " de daño";

}

hp1 -= daño;

}

}

if(hp1 < 0) hp1 = 0;
if(hp2 < 0) hp2 = 0;

document.getElementById("p1Hp").textContent = hp1;
document.getElementById("p2Hp").textContent = hp2;

log.textContent = texto;

if(hp1 <= 0 || hp2 <= 0){

clearInterval(turno);

var ganador;

if(hp1 > hp2){
ganador = p1;
}else{
ganador = p2;
}

mostrarGanador(ganador);

}

},1500);

}

function mostrarGanador(pokemon){

var winnerArea = document.getElementById("winnerArea");

winnerArea.innerHTML =

"<h2>🏆 GANADOR</h2>" +
"<h3>"+pokemon.name+"</h3>" +
"<img src='"+pokemon.img+"' width='200'>" +
"<br><br>" +
"<button onclick='location.reload()'>Hacer otra batalla</button>";

}
