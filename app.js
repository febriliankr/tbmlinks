  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyD8c8BQfyPOblq4t4okQLaudfli2jpefkk",
    authDomain: "portal-links-tbm.firebaseapp.com",
    databaseURL: "https://portal-links-tbm.firebaseio.com",
    projectId: "portal-links-tbm",
    storageBucket: "portal-links-tbm.appspot.com",
    messagingSenderId: "160639293475",
    appId: "1:160639293475:web:8c3d5f770e5ceaf05bb996",
    measurementId: "G-KCVTRE0GBN"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


const db = firebase.firestore();
const links = db.collection('links');
const list = document.querySelector('.list-group');
const wholeForm = document.querySelector('.add');

const successMessage = document.querySelector('.success-message');
const inputPassword = document.querySelector('.admin-password');

const passwordSet = 'tbmfkui';
let accessGained = false;

//show input kalo password bener
inputPassword.addEventListener('keyup', () =>{
  const pass = inputPassword.value.trim().toLowerCase();
  if (pass == passwordSet){
    if(wholeForm.classList.contains('hidden')){
      accessGained = true;
      wholeForm.classList.remove('hidden');
    }
  }
});


//fungsi addlist
const addList = (l, id) =>{
    let ret = l.url;
    const eos0 = ret.indexOf('//');
    //console.log('eos0:', eos0);
    ret = ret.substr(eos0+2,);
    const eos1 = ret.indexOf('/');
    if(eos1>2){ret = ret.substr(0,eos1);}
    // console.log(eos1);
    
    let tag;
    if(l.tag){tag = l.tag;} else {tag='';}


  let html=`
    <li data-id="${id}" class="list-group-item d-flex justify-content-between align-items-center">
    <span>${l.desc} &mdash; <a href="${l.url}">${ret}</a><br><small>${l.bidang}</small></span>
    <div class="hidden">${tag}</div>
    <i class="far fa-circle delete"></i>
  </li>
  `;
  list.innerHTML += html;
  //console.log(html);
}

//get snapshot from firebase
links.get().then((snapshot)=>{
    //when we have the data
    snapshot.docs.forEach(doc =>{
      //console.log(doc.id);
      addList(doc.data(), doc.id);
    });
    //console.log(snapshot.docs[0].data());
  }
    
  ).catch(err => {
      console.log("Error getting document",err);
});


const add = document.querySelector('.add');
const search = document.querySelector('.search input');
const submitForm = document.querySelector('.submit_form');

//console.log(add[0].value);
// console.log(add[1]);
// console.log(add[2]);
// console.log(add[3]);
// bidang, nama link, url, tag

submitForm.addEventListener('click', e => {
  e.preventDefault();
  const namaBidang = add[0].value.trim();
  const namaLink = add[1].value.trim();
  const namaUrl = add[2].value.trim();
  const namaTag = add[3].value.trim();
  console.log('bidang:',namaBidang);

  const linkObject = {
    bidang: namaBidang,
    desc: namaLink,
    url: namaUrl,
    tag: namaTag
  };

  db.collection('links').add(linkObject).then(()=>{
    const linkAdded = `
    <div class="card text-white bg-success mb-3 my-4">
    <div class="card-header">Success!</div>
    <div class="card-body">
      <h5 class="card-title">Your link for ${namaBidang} has been added.</h5>
      <p class="card-text">${namaLink} &mdash; ${namaUrl}<br>Tags: ${namaTag}</p>
    </div>
    </div>
    `;
    successMessage.innerHTML += linkAdded;
  }).catch(err=> {
    console.log('error inserting to firebase');
  });

  add.reset();
  
});


//NOT A FIREBASE EVENT
// const generateTemplate = todo => {
//     const html = `
//     <li class="list-group-item d-flex justify-content-between align-items-center">
//     <span>${todo}</span>
//     <i class="far fa-trash-alt delete"></i>
//     </li>
//     `;
//     list.innerHTML += html;
// };

// add.addEventListener('submit', e => {
//     e.preventDefault();
//     const todo = add.add.value.trim();
//     console.log(todo);
//     if (todo.length){
//         generateTemplate(todo);
//         add.reset();
//     }
// });

//Deleting
list.addEventListener('click', e =>{
    //console.log(e.target.classList); 
    if(e.target.classList.contains('delete')&& accessGained){
      const id = e.target.parentElement.getAttribute('data-id');
      console.log(id); 
      db.collection('links').doc(id).delete().then(()=>{
        e.target.parentElement.innerHTML = `<p class="text-light">Link successfully deleted!</p>`;
      }
      );
    } 
    //kalo ada access, hapus

});

const filterTodos = (term) =>{
    Array.from(list.children)
        .filter((todo) => !todo.textContent.toLowerCase().includes(term))
        .forEach((todo) => todo.classList.add('filtered'));

    Array.from(list.children)
        .filter((todo) => todo.textContent.toLowerCase().includes(term))
        .forEach((todo) => todo.classList.remove('filtered'));
};

//to search, keyup event
search.addEventListener('keyup', () =>{
    const term = search.value.trim().toLowerCase();
    filterTodos(term); 
});
