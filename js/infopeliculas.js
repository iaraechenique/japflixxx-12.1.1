
let moviesData = [];

window.addEventListener('load', function() {
  fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => response.json())
    .then(data => {
        moviesData = data; 
      console.log("Películas cargadas:", moviesData);
    })
    .catch(error => console.error('Error al cargar los datos:', error));
});

document.getElementById('btnBuscar').addEventListener('click', function() {
  const searchTerm = document.getElementById('inputBuscar').value.toLowerCase(); // Obtener el término de búsqueda y convertirlo a minúsculas
  const moviesDiv = document.getElementById('lista');
  moviesDiv.innerHTML = ''; // Limpiar la lista antes de mostrar resultados

  // Filtrar las películas que coincidan con el término de búsqueda (en el título o en el tagline)
  const filteredMovies = moviesData.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm) || 
    (movie.tagline && movie.tagline.toLowerCase().includes(searchTerm))
  );

  // Mostrar los resultados filtrados
  if (filteredMovies.length > 0) {
    filteredMovies.forEach(movie => {
      const movieItem = document.createElement('li');
      movieItem.classList.add('list-group-item'); // Agregar una clase para mejor presentación

      // Convertir vote_average en estrellas (máximo 5 estrellas)
      const starRating = generateStars(movie.vote_average);

      // Mostrar el título, tagline y las estrellas en lugar del número vote_average
      movieItem.innerHTML = `<span class="titulo">${movie.title}</span> <br/> <span class="descripcion">${movie.tagline}</span> ${starRating}`;
      movieItem.addEventListener('click', () => showMovieDetails(movie)); // Añadir evento para mostrar detalles
      moviesDiv.appendChild(movieItem);
    });
  } else {
    const noResultsItem = document.createElement('li');
    noResultsItem.classList.add('list-group-item');
    noResultsItem.textContent = 'No se encontraron películas con ese término de búsqueda.';
    moviesDiv.appendChild(noResultsItem);
}
});

function generateStars(vote_average) {
  const maxStars = 5;
  const starFull = '<span class="star-full">★</span>'; // Estrella llena
  const starEmpty = '<span class="star-empty">☆</span>'; // Estrella vacía

  // Convertimos la calificación de 0-10 a un rango de 0-5
  const starCount = Math.round((vote_average / 10) * maxStars);

  // Generamos el string de estrellas llenas y vacías
  return `<div class="star-container">${starFull.repeat(starCount) + starEmpty.repeat(maxStars - starCount)}</div>`;
}



function showMovieDetails(movie) {
   
    document.getElementById('offcanvasTitle').textContent = movie.title;
    document.getElementById('offcanvasOverview').textContent = movie.overview;
  

  const genresList = document.getElementById('offcanvasGenres');
  genresList.innerHTML = ''; // Limpiar la lista de los géneros
  movie.genres.forEach(genre => {
    const genreItem = document.createElement('li');
    genreItem.textContent = genre.name; // Acceder al nombre del género de la peli
    genresList.appendChild(genreItem);
  });

  const dropdownItems = `
  <li><a class="dropdown-item" href="#">Year: ${new Date(movie.release_date).getFullYear()}</a></li>
  <li><a class="dropdown-item" href="#">Runtime: ${movie.runtime} minutes</a></li>
  <li><a class="dropdown-item" href="#">Budget: $${movie.budget.toLocaleString()}</a></li>
  <li><a class="dropdown-item" href="#">Revenue: $${movie.revenue.toLocaleString()}</a></li>
`;


const dropdownMenu = document.querySelector('.dropdown-menu');
dropdownMenu.innerHTML = dropdownItems;

    const offcanvasElement = document.getElementById('movieOffcanvas');
    const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
    bsOffcanvas.show();
  }

 