console.log("hello from final project", axios);

function fetchSearchParams (searchText) {
    axios
    .get ('https://travel-advisor.p.rapidapi.com/locations/search', {
        params: {
            query: searchText,
            limit: '30',
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
    })
    .catch(err =>{
        console.warn('Error loading search results:', err);
    });

}

fetchSearchParams('London');