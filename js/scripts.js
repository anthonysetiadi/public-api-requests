// Declare variables //
const searchContainer = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');

/**
 * Get and Display 12 random users from 
 * https://randomuser.me
 * API call for users in US only
 */
 fetch('https://randomuser.me/api/?results=12&nat=us')
 .then(checkStatus)
 .then(res => res.json())
 .then(data => {
   usersData = data.results
   console.log(usersData)
   generateGallery(usersData)
   modalData(usersData)
 })
 .catch(error => console.log('Looks like there was a problem!', error))


// Gallery markup //
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
    </div>
  `
  return modalHTML;
}



// -----------------------
// HELPER FUNCTIONS
// -----------------------

// Check Status of Fetch Request //
function checkStatus(response) {
  if(response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
};

// Generate gallery of 12 random users to display on Page //
function generateGallery(data) {
  data.forEach(user => {
    gallery.insertAdjacentHTML('beforeend', galleryHTML(user));
  });
}

// Retrieve data of selected user to Display on Modal //
function modalData (data) {
  const cards = document.querySelectorAll(".card")
  for(let i = 0; i < data.length; i++) {
    cards[i].addEventListener('click', e => {
      selectedCard = data.indexOf(data[i])
      console.log(data[i])
      console.log (selectedCard)
      generateModal(data[selectedCard])
    })
  }
}

// Dynamically display Modal with data from ModalData //
function generateModal(data) {
  gallery.insertAdjacentHTML('afterend', modalHTML(data))
  showModal()
  closeModal()
  }

/**
 * MODAL FUNCTIONALITY
 */

// Show Modal //
function showModal() {
  const modalContainer = document.querySelector('.modal-container')
  modalContainer.style.display = "block";
}

// Hide Modal //
function closeModal() {
  const closeBtn = document.querySelector(".modal-close-btn");
  const modalContainer = document.querySelector('.modal-container')
  closeBtn.addEventListener('click', () => {
    modalContainer.remove();
  })
  document.addEventListener('keyup', e => {
    if (e.key === "Escape") {
      closeBtn.click();
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


