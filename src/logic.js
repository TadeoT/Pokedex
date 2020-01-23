/// <reference types="jquery" />

url = "https://pokeapi.co/api/v2/pokemon/"
siguiente(url);


document.querySelector('#buscar').onclick = function(params) {
    let nombre = document.querySelector('#nombre').value;
    let urlDetalle = "https://pokeapi.co/api/v2/pokemon/" + nombre +"/";
    detalles(urlDetalle)
}

function detalles(urlPokemon) {

    fetch(urlPokemon)
    .then(respuesta => respuesta.json())
    .then(respuestaJSON => {

        $('#cartaIndividual').html('');

        $('#cartaIndividual').append($(`
        <div class="card" style="width: 18rem;">
        <img class="card-img-top" src="${respuestaJSON.sprites.front_shiny}" alt="Card image cap">
        <div class="card-body">
          <h4 class="card-title">${respuestaJSON.name}</h4>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Tipo : ${respuestaJSON.types[0].type.name}</li>
          <li class="list-group-item">Habilidades : ${respuestaJSON.abilities[0].ability.name} , ${respuestaJSON.abilities[1].ability.name}</li>
          <li class="list-group-item">Altura: ${respuestaJSON.height/10} m</li>
          <li class="list-group-item">Peso: ${respuestaJSON.weight/10} kg</li>
        </ul>
      </div>
        
        `));
    })
    .catch(error => console.error("FALLO indivual",error));

}

function siguiente(urlSiguiente) {

    $('#contenedor').html('')
    $('#paginacion').html('')

    fetch(`${urlSiguiente}`)
    .then(respuesta => respuesta.json())
    .then(respuestaJSON =>{
        let siguienteUrl = respuestaJSON.next;
        let anteriorUrl = respuestaJSON.previous;

        respuestaJSON.results.forEach(pokemon => {
            let imagenPokemon = "";
            let urlPokemon = pokemon.url;

            fetch(`${urlPokemon}`)
                .then(respuestaPokemon => respuestaPokemon.json())
                .then(respuestaPokemonJson => {
                    
                    imagenPokemon = respuestaPokemonJson.sprites.back_default;
                    $("#contenedor").append($(`
                    <div  class="card" style="width: 18rem;">
                    <img class="imagenesPokemon" src="${imagenPokemon}">
                    <div class="card-body">
                    <h4 class="card-title">${pokemon.name}</h4>
                    <a href="#" onclick=detalles("${urlPokemon}") class="stretched-link">Ver</a>
                    `
                    ))

                })
                .catch(error => console.error("FALLO",error));
            
        });;


        $('#paginacion').append($(`
        <nav aria-label="...">
        <ul id="subPaginacion" class="pagination">
        </nav>
        `));
        if(!anteriorUrl == "")
        {
            $('#subPaginacion').append($(`
            <li class="page-item">
            <a class="page-link" onclick=siguiente("${anteriorUrl}") href="#" tabindex="-1">Anterior</a>
            </li>
            `));
        }
        if(!siguienteUrl == ""){
            $('#subPaginacion').append($(`
            <li class="page-item"> 
              <a class="page-link" onclick=siguiente("${siguienteUrl}") href="#">Siguiente</a>
            </li>
            `));
        }
    })
    .catch(error => console.error("FALLO",error));
}



