console.log ('Hello from final project', axios);

// window.addEventListener('load',() => {
//     let long;
//     let lat;

//     if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(position => {
//               lat = position.coords.latitude;
//               long = position.coords.longitude;
//               console.log(`Latitude: ${lat}, Longitude: ${long}`);
//             });
//     } else {
//     console.log("Geolocation is not supported by this browser.");
//     }

// }); //Current Weather - getting geolocation from browser

const searchFormNode = document.querySelector('#searchForm');
const userSearchInput = document.querySelector('#locationQuery');
const resultsParent = document.querySelector('.searchResults');
const secondParent = document.querySelector('.secondaryResults');



let locationId;
let locationLatitude;
let locationLongitude;

searchFormNode.addEventListener('submit', ev => {
    //console.log ('Form Submitted!');
    ev.preventDefault();
  
    resultsParent.replaceChildren();
    fetchSearchParams(userSearchInput.value);
    console.log(userSearchInput.value);
  })        // event listner on form to handle form-submit



function fetchSearchParams (searchText) {
    axios
    .get ('https://travel-advisor.p.rapidapi.com/locations/search', {
        params: {
            query: searchText,
            location_id: '1',
            sort: 'relevance',
            lang: 'en_US'
          },
          headers: {
            'X-RapidAPI-Key': '7da1a336demsh92e2fa75c0d6449p17580ajsn839b96504625',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
          }
    })
    .then(res => {
        console.log ('Response Received');
        console.log (res.data.data);
        renderSearchResults(res.data.data);
    })
    .catch(err =>{
        console.warn('Error loading search results:', err);
    });

}               // function with AJAX request to get basic parameters for desitnation searched

const renderSearchResults = (results) => {
   
    results.forEach(element => {
        if(element.result_type==="geos"){

            // console.log(element.result_object.location_id);
            const locationSearchDiv = document.createElement('div')
            
            locationSearchDiv.id = element.result_object.location_id;
            locationSearchDiv.className = 'locationResults';
            locationSearchDiv.dataset.lat = element.result_object.latitude;
            locationSearchDiv.dataset.long = element.result_object.longitude;
            locationSearchDiv.dataset.dest = element.result_object.name;
            locationSearchDiv.innerHTML = `<h3>${element.result_object.name}</h3>
                <p>${element.result_object.location_string}</p>`;
            locationSearchDiv.style.backgroundImage = `url(${element.result_object. photo.images.medium.url})`;
           
            resultsParent.appendChild(locationSearchDiv);
            
        }
    });


}              // function to display search results for destination searched

resultsParent.addEventListener('click', ev => {

    console.log ('id', ev.target.id);

    resultsParent.replaceChildren();

    const divWhatTo = createDivFunction('WhatTo', 'Look for:' );
    const divRestuarants = createDivFunction('restuarantSearchDiv', 'Restuarants');
    const divHotels = createDivFunction('hotelsSearchDiv', 'Hotels');
    const divAttractions = createDivFunction('attractionsSearch', 'Attractions');

    secondParent.appendChild(divWhatTo);
    secondParent.appendChild(divRestuarants);
    secondParent.appendChild(divHotels);
    secondParent.appendChild(divAttractions);

    locationId = ev.target.id;
    locationLatitude = ev.target.dataset.lat;
    locationLongitude=ev.target.dataset.long;
    
    
    //if for details visible to be completed//

});         // event listener to progress to secondary-search


secondParent.addEventListener('click', ev => {
    console.log ('element clicked', ev.target);

    secondParent.replaceChildren();

    fetchRestuarantList(locationId);

}); // secondary search event listener

function fetchRestuarantList (location) {
    axios
        .get('https://travel-advisor.p.rapidapi.com/restaurants/list', {

        params: {
            location_id: location,
            limit: 12,
            lang: 'en_US'
          },
          headers: {
            'X-RapidAPI-Key': '7da1a336demsh92e2fa75c0d6449p17580ajsn839b96504625',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
          }
        })
        .then (res => {
        console.log ('Resturant response Received');
        console.log (res.data.data);
        renderResturantList(res.data.data);
        })
        .catch(err =>{
            console.warn('Error loading resturant results:', err);
        });
    
    
    
}               // function with AJAX request to get restuarant lists


const renderResturantList = (result) => {
    result.forEach(element => {

        const restuarantListDiv = document.createElement ('div');

        restuarantListDiv.id = element.location_id;
        restuarantListDiv.className='restuarantList';
        restuarantListDiv.innerHTML= `
        <h4>${element.name}</h4><br />
        <h5>${element.address}</h5><br />
        <img src='${element.photo.images.small.url}'>
        <p> ${element.description}</p>
        `,

        secondParent.appendChild(restuarantListDiv);
    })

}           // function to display search results for resturants at the destination



const createDivFunction = (divId, innerText) => {
    const divCreated = document.createElement ('div');
    divCreated.id = divId;
    divCreated.innerHTML = `<h3> ${innerText} </h3>`

    return divCreated;
}                       // function to create interim divs after location selection





// Test only:

//fetchSearchParams('San Martino');

//fetchRestuarantList('186338');