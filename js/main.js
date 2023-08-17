console.log ('Hello from final project', axios);

const currentWeather = document.querySelector('#currentWeather');
const searchFormNode = document.querySelector('#searchForm');
const userSearchInput = document.querySelector('#locationQuery');
const resultsParent = document.querySelector('.searchResults');
const secondParent = document.querySelector('.secondaryResults');
const destinationWeather = document.querySelector('#destinationWeather');

let long;
let lat;
let locationId;
let locationLatitude;
let locationLongitude;

window.addEventListener('load',() => {
   

    if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
              lat = position.coords.latitude;
              long = position.coords.longitude;
              console.log(`Latitude: ${lat}, Longitude: ${long}`);
              getCurrentWeather (lat, long);
            });
    } else {
    console.log("Geolocation is not supported by this browser.");
    }
});     // load current weather on browser load via geo location


searchFormNode.addEventListener('submit', ev => {
    //console.log ('Form Submitted!');
    ev.preventDefault();
  
    resultsParent.replaceChildren();
    secondParent.replaceChildren();
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
                <p id="titles">${element.result_object.location_string}</p>`;
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
    
    getCurrentWeather (locationLatitude,locationLongitude);
    
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
    
        if (element.name && element.photo){

            const restuarantListDiv = document.createElement ('div');
            
                restuarantListDiv.id = element.location_id;
                restuarantListDiv.className='restuarantList';
            
                restuarantListDiv.innerHTML= `
                <h3>${element.name}</h3><br />
                <h5>${element.address}</h5><br />
                <img src='${element.photo.images.small.url}'>
                <p> ${element.description}</p>
                `,

            secondParent.appendChild(restuarantListDiv);
        }
    });

}           // function to display search results for resturants at the destination



const createDivFunction = (divId, innerText) => {
    const divCreated = document.createElement ('div');
    divCreated.id = divId;
    divCreated.innerHTML = `<h3> ${innerText} </h3>`

    return divCreated;
}                       // function to create interim divs after location selection



function getCurrentWeather (lat,long) {
    axios
    .get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${long}?key=PHJP3AFRWNKN7VEXS93ABLQU6`)
    .then( res =>{
        const tempCurr = parseInt(((res.data.days[0].temp)-32)*(5/9));

           currentWeather.innerHTML = `
           <h3> ${res.data.timezone} </h3> <br /> 
           <h1> ${tempCurr} º C </h1>`         

    })
    .catch(err =>{
        console.warn('Error loading search results:', err);
    });


} //Current Weather - API

function getdestinationWeather (lat,long) {
    axios
    .get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${long}?key=PHJP3AFRWNKN7VEXS93ABLQU6`)
    .then( res =>{
        const tempDest = parseInt(((res.data.days[0].temp)-32)*(5/9));
        
        currentWeather.replaceChildren();

           destinationWeather.innerHTML = `
           <h3> ${res.data.timezone} </h3> <br /> 
           <h1> ${tempDest} º C </h1>`         

    })
    .catch(err =>{
        console.warn('Error loading search results:', err);
    });


} //Current Weather - API

// Test only:

//fetchSearchParams('San Martino');

//fetchRestuarantList('186338');