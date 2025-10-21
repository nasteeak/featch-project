import './style.css'

// const container = document.getElementById("app");

// fetch('http://localhost:3000/posts?userId=2')
//  .then((response) => {
//  	if (response.ok) return response;
//  	throw new Error(`${response.status} —  							${response.statusText}`);
//  })
//  .then((response) => response.json())
//  .then((posts) => {
//   posts.forEach((post)=> {
//     let card = document.createElement('div');
//     card.innerHTML = `<h2>${post.title}</h2>`;
//     card.classList.add('card');
//     container.append(card);
//   });
//  })
//  .catch((error) => console.log(error));

//  const article = document.querySelector('.article');

//  async function myFetch(){
//   let response = await fetch('http://locahost:3000/posts/1');
//   let post = await response.json();
//   let card = document.createElement('div');
//     card.innerHTML = `<h2>${post.title}</h2><p>post.body</p>`;
//     card.classList.add('card');
//     container.append(card);
//  }
//  myFetch();