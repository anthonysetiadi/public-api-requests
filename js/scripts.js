// Declare variables //
const randomUsersUrl = 'https://randomuser.me/api/?results=12&nat=us'
const searchContainer = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');
let usersData = []
let selectedCard

/**
 * Get and Display 12 random users from 
 * https://randomuser.me
 * API call for users in US only
 */

fetch(randomUsersUrl)
  .then(checkStatus)
  .then(res => res.json())
  .then(data => {
    usersData = data.results
    console.log(usersData)
    generateGallery(usersData)
    modalData(usersData)
    })
  .catch(error => console.log('Looks like there was a problem!', error))

// Generate gallery of 12 random users to display on Page //
function generateGallery(data) {
  gallery.innerHTML = ''
  const galleryHTML = data.map(user => {
    return `
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
  })
  .join('');
  gallery.insertAdjacentHTML('beforeend', galleryHTML)
}

// Modal Markup //
function modalHTML(user) {
  let modalHTML = `
    <div class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${user.picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="modal-text">${user.email}</p>
            <p class="modal-text cap">${user.location.city}</p>
            <hr>
            <p class="modal-text">${formatCell(user.cell)}</p>
            <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.postcode}</p>
            <p class="modal-text">Birthday: ${user.dob.date.slice(5,7)}/${user.dob.date.slice(8,10)}/${user.dob.date.slice(0,4)}</p>
        </div>
          <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
          </div>
    </div>
  `
  return modalHTML;
}

// Search Bar Markup //
const searchHTML = `
  <form action="#" method="get">
  <input type="search" id="search-input" class="search-input" placeholder="Search...">
  <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>`
searchContainer.insertAdjacentHTML('beforeend', searchHTML);


// -----------------------
// HELPER FUNCTIONS
// -----------------------
function checkStatus(response) {
  if(response.ok) {
      return Promise.resolve(response);
  } else {
      return Promise.reject(new Error(response.statusText));
  }
}

// Retrieve data of selected user to Display on Modal //
function modalData (data) {
  const cards = document.querySelectorAll(".card")
  for(let i = 0; i < data.length; i++) {
    cards[i].addEventListener('click', e => {
      selectedCard = data.indexOf(data[i])
      generateModal(data[selectedCard])
    })
  }
}

// Dynamically display Modal with data from ModalData //
function generateModal(data) {
  gallery.insertAdjacentHTML('beforeend', modalHTML(data))
  showModal()
  closeModal()
  modalToggle()
  }

/**
 * MODAL FUNCTIONALITY
 */


// Show Modal //
function showModal() {
  const modalContainer = document.querySelector('.modal-container')
  modalContainer.style.display = "block";
}

// Close Modal //
function closeModal() {
  const closeBtn = document.querySelector(".modal-close-btn");
  const modal = document.querySelector('.modal')
  const modalContainer = document.querySelector('.modal-container');
  closeBtn.addEventListener('click', () => {
    modalContainer.remove()
  })
  document.addEventListener('keyup', e => {
    if (e.key === "Escape") {
      closeBtn.click();
    }
  })
  document.addEventListener('click', e => {
    if (e.target == modalContainer){
      modalContainer.remove()
    }
  })
}

// Prev and Next Users in Modal //
function modalToggle() {

const modalBtnContainer = document.querySelector('.modal-btn-container')
const modalContainer = document.querySelector('.modal-container')
const prevBtn = document.querySelector('#modal-prev')
const nextBtn = document.querySelector('#modal-next')
const cards = document.querySelectorAll(".card")

  modalBtnContainer.addEventListener('click', e => {
    if (e.target === prevBtn) {
      displayPrevModal()
    } else if (e.target === nextBtn) {
      displayNextModal()
    } 
    modalContainer.remove();
    generateModal(usersData[selectedCard])

    function displayPrevModal() {
      if (selectedCard === 0) {
        prevBtn.disabled = true
      } else if (selectedCard > 0)
        selectedCard --;
      } 

    function displayNextModal() {
      if (selectedCard === cards.length -1) {
        nextBtn.disabled = true;
      } else if(selectedCard < cards.length -1) {
        selectedCard ++;
      } 
    }

  })
}


// Format Phone Number //
function formatCell(phoneNumberString) {  
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
}

// Search for Name Match //

const searchBar = document.querySelector('#search-input')
const searchSubmit = document.querySelector('#search-submit')

const searchName = () => {
  let input = searchBar.value
  const filteredNames = usersData.filter(names => {
    const fullName = `${names.name.first.toLowerCase()} ${names.name.last.toLowerCase()}`
    return fullName.includes(input.toLowerCase())
  })
  
  // Show error if no results found
  if (filteredNames.length == 0) {
    gallery.innerHTML = 'No results found. Try another search.'
  } else if (filteredNames.length >= 1) {
    generateGallery(filteredNames)
  } else {
    generateGallery(usersData)
  } 
}

/**
 * EVENT LISTENERS
 */
searchBar.addEventListener('keyup', searchName)
searchSubmit.addEventListener('click', searchName)
