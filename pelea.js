var id1 = localStorage.getItem("pokemon1");
var id2 = localStorage.getItem("pokemon2");

var p1;
var p2;

Promise.all([
fetch("https://pokeapi.co/api/v2/pokemon/" + id1).then(r=>r.json()),
fetch("https://pokeapi.co/api/v2/pokemon/" + id2).then(r=>r.json())
])
.then(function(data){

p1 = prepararPokemon(data[0]);
p2 = prepararPokemon(data[1]);

mostrarPokemon(p1,"p1");
mostrarPokemon(p2,"p2");

iniciarBatalla();

});

function prepararPokemon(data){

var stats = {};

for(var i=0;i<data.stats.length;i++){
stats[data.stats[i].stat.name] = data.stats[i].base_stat;
}

return{
name:data.name,
img:data.sprites.front_default,
type:data.types.map(t=>t.type.name).join(", "),
hp:stats.hp,
attack:stats.attack,
defense:stats.defense,
spatk:stats["special-attack"],
spdef:stats["special-defense"]
};

}

function mostrarPokemon(p,prefix){

document.getElementById(prefix+"Name").textContent = p.name;
document.getElementById(prefix+"Img").src = p.img;
document.getElementById(prefix+"Type").textContent = "Tipo: " + p.type;

document.getElementById(prefix+"Stats").innerHTML =
"<li>Attack: "+p.attack+"</li>"+
"<li>Defense: "+p.defense+"</li>"+
"<li>Special Attack: "+p.spatk+"</li>"+
"<li>Special Defense: "+p.spdef+"</li>";

}

function iniciarBatalla(){

var hp1 = 100;
var hp2 = 100;

var log = document.getElementById("battleLog");

var turno = setInterval(function(){

var atacante = Math.random() < 0.5 ? 1 : 2;

if(atacante === 1){

var daño = calcularDaño(p1,p2);

hp2 -= daño;
if(hp2 < 0) hp2 = 0;

log.textContent = p1.name + " ataca y causa " + daño + " de daño";

}else{

var daño = calcularDaño(p2,p1);

hp1 -= daño;
if(hp1 < 0) hp1 = 0;

log.textContent = p2.name + " ataca y causa " + daño + " de daño";

}

document.getElementById("p1Hp").textContent = hp1;
document.getElementById("p2Hp").textContent = hp2;

if(hp1 <=0 || hp2 <=0){

clearInterval(turno);

if(hp1 > hp2){
log.textContent = "Ganador: " + p1.name;
}else{
log.textContent = "Ganador: " + p2.name;
}

}

},1500);

}

function calcularDaño(atacante,defensor){

var especial = Math.random() < 0.3;

if(especial){

var daño = atacante.spatk - defensor.spdef/2;
return Math.floor(daño/5);

}else{

var daño = atacante.attack - defensor.defense/2;
return Math.floor(daño/5);

}

}
