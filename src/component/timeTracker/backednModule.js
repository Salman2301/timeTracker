const fetch = require('node-fetch');



function getJSON(url, options={}) {
  return fetch(url, options)
  .then(httpRes =>{
    if(!httpRes.ok) throw new Error("status is not ok :")
    return httpRes.json();
  })
}