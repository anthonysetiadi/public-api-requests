// Declare variables //
const searchContainer = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');



// Gallery markup:
function galleryHTML(user) {
  const galleryHTML = `
      <div class="card">
          <div class="card-img-container">
              <img class="card-img" src="${user.picture.medium}" alt="profile picture">
          </div>
          <div class="card-info-container">
              <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
              <p class="card-text">${user.email}</p>
              <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
          </div>
      </div>
    `
      return galleryHTML;
  }

/**
 * Get and Display 12 random users from 
 * https://randomuser.me
 * Image, first and last name, email, city or location
 */
fetch('https://randomuser.me/api/?results=12')
  .then(checkStatus)
  .then(res => res.json())
  .then(data => {
    users = data.results
    console.log(users)
    generateGallery(users)
  })
  .catch(error => console.log('Looks like there was a problem!', error))


// -----------------------
// HELPER FUNCTIONS
// -----------------------
function checkStatus(response) {
  if(response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
};

function generateGallery(data) {
  data.forEach(user => {
    gallery.insertAdjacentHTML('beforeend', galleryHTML(user));
  });
}


// Search markup:

// const searchHTML = `
//     <form action="#" method="get">
//         <input type="search" id="search-input" class="search-input" placeholder="Search...">
//         <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
//     </form>
//     `

