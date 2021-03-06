  //Start of IIFE
  const pokemonRepository = (function () {
      
      const pokemonList = [];
      let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    

  //add new pokemon to pokemonList
  function add(pokemon) {
    // "add" function adds pokemon to the "pokemonList" via the "push" function
    pokemonList.push(pokemon);
  }
  //return all pokemons
    function getAll() {
      return pokemonList;
    }

    const searchTextBox = document.getElementById("search-poke");
    searchTextBox.addEventListener("input", searchPokemon);

    //Find a pokemon by name
    function searchPokemon(e) 
    {
      const userSearch = e.target.value;
      document.querySelectorAll("li").forEach(function(i) {
        if (i.innerText.toLowerCase().includes(userSearch.toLowerCase())) {
          i.style.display = '';
        }
        else {
          i.style.display = 'none';
        }
      });
    }

  //create button of pokemons
    function addListItem(pokemon){
      const pokemonList = document.querySelector('.list-group');
      const listpokemon = document.createElement('li');
      const button = document.createElement('button');
      button.innerText = pokemon.name;
      button.classList.add('btn-primary');
      listpokemon.classList.add('group-list-item');
      listpokemon.appendChild(button);
      pokemonList.appendChild(listpokemon);
      button.addEventListener('click', function() {
        showDetails(pokemon);
    })
  }
    //load list of pokemon from apiUrl
    function loadList() {
        return fetch(apiUrl).then(function (response) {
          return response.json();
        }).then(function (json) {
          json.results.forEach(function (item) {
            const pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
            console.log(pokemon);
          });
        }).catch(function (e) {
          console.error(e);
        });
      }
  //load data of each pokemon when click on pokemon
      function loadDetails(item) {
        const url = item.detailsUrl;
        return fetch(url).then(function (response) {
          return response.json();
        }).then(function (details) {
          // Now we add the details to the item
          item.imageUrl = details.sprites.other.dream_world.front_default;
          item.height = details.height;
          item.weight = details.weight;
          item.types = details.types;
          item.abilities = [];
          for (const i = 0; i < details.abilities.length; i++) {
            item.abilities.push(details.abilities[i].ability.name);
          }
        }).catch(function (e) {
          console.error(e);
        });
      }
  //after click on pokemon button,load the data of pokemon from server
      function showDetails(item) {
        loadDetails(item).then(function () {
          showModal(item);
        });
      }

      function showModal(item) {
        // showModal function
        const modalTitle = $('.modal-title'); // modalTitle
        const modalBody = $('.modal-body'); // modalBody
        // const modalHeader = $(".modal-header"); // no header so removed

        const pokemonName = $('<h2>' + item.name + '</h2>');

        const pokemonHeight = $('<p>' + 'Height: ' + item.height + '</p>');

        const pokemonWeight = $('<p>' + 'Weight: ' + item.weight + '</p>');

        const pokemonAbilities = $('<p>' + 'Abilities: ' + item.abilities + '</p>');

        const pokemonImage = $('<img class=\'pokemon-modal-image\'>');
        pokemonImage.attr('src', item.imageUrl); // pokemon image attribute loaded from 'item.imageUrl'

        //Injecting values into the div
        $('.height__attr').text(item.height * 10 + 'cm');
        $('.weight__attr').text(item.weight / 10 + 'kg');

        //Spacing properly the list of abilities
        const skills = item.abilities.join(', ');
        $('.abilities__attr').text(skills);

        modalTitle.empty(); // clears the modalTitle after display
        modalBody.empty(); // clears the modalBody after display

        modalTitle.append(pokemonName); // pokemonName is displayed as the title in the modal
        modalBody.append(pokemonImage); // pokemonImage is displayed in the body of the modal
        modalBody.append(pokemonHeight); // pokemonHeight is displayed in the body of the modal
        modalBody.append(pokemonWeight); // pokemonWeight is displayed in the body of the modal
        modalBody.append(pokemonAbilities); // pokemonDetails are displayed in the body of the modal
      }

    return {
      add,
      getAll,
      addListItem,
      loadList,
      loadDetails,
      showDetails
    };
  })();//end of IIFE


  pokemonRepository.loadList().then(function() {
    pokemonRepository.getAll().forEach(function(pokemon){
      pokemonRepository.addListItem(pokemon);
    });
  });
