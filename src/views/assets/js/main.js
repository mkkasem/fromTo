/* eslint-disable strict */
(function () {
  'use strict';
})();

async function getPosts() {
  /* const response = await fetch('/api/posts/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  } */
  // eslint-disable-next-line no-undef
  $.ajax({
    url: '/api/posts/',
    type: 'GET',
    contentType: 'application/json',
    success: (data) => {
      document.write(data);
    },
    error: (err) => {
      console.log(err);
    },
  });
}
