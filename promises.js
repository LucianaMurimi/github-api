//userReposUL, userImage and logoImage variables will be used in -> removeChildNodes(), updateUserImgUI()
// and updateUserReposUI() functions and therefore defined in the global scope
let userReposUL = document.querySelector('#userRepos');
let userImage = document.querySelector('.img');
let logoImage = document.querySelector('.logo-img')

function removeChildNodes() {
    //childNodes to be removed -> userImage, userReposUL
    if(userImage.hasChildNodes()){
        userImage.removeChild(userImage.firstChild);
    }
    if(userReposUL.hasChildNodes()) {
        while(userReposUL.hasChildNodes()){
            userReposUL.removeChild(userReposUL.firstChild);
        }
    }
}

let getUserData = (URL) => {
    return new Promise((resolve, reject) => {
        //1. creating a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();

        //2. defining Github API endpoint
        const url = URL;

        //3. opening a new connection
        xhr.open('GET', url, true);

        //4. on receiving request, process it here:
        xhr.onload = function() {
            //parse API data ito JSON
            const data = JSON.parse(this.response);
            resolve(data);
        }

        //5. on error reject
        xhr.onerror = () => reject(xhr.statusText);

        //6. sending the request
        xhr.send();
    });
}

let updateUserImgUI = (data) => {
    return new Promise((resolve, reject) => {
        if(logoImage.hasChildNodes()){
            logoImage.removeChild(logoImage.firstChild);
        }
        
        let img = document.createElement('img');
        img.setAttribute('src', `${data.avatar_url}`);
        img.setAttribute('style', `height: 150px;width: 150px`);
        userImage.append(img);

        resolve();
    });
}

function updateUserReposUI (data) {
    for(let i in data){
        let li = document.createElement('li');
        li.innerHTML = (`
                <p><strong>Repo: </strong>${data[i].name}</p>
                <p><strong>Description: </strong>${data[i].description}</p>
                <p><strong>URL: </strong><a href="${data[i].html_url}">${data[i].html_url}</a></p>
        `);
        userReposUL.appendChild(li);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    //1. Get the Github username input form 
    const githubForm = document.getElementById('gitHubForm');

    //2. listen for submissions on Github username input form
    githubForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let username = document.getElementById('usernameInput').value;

        if(username !== ''){
            removeChildNodes();

            getUserData(`https://api.github.com/users/${username}`)
            .then(res => updateUserImgUI(res))
            .then(() => getUserData(`https://api.github.com/users/${username}/repos`))
            .then(res => updateUserReposUI(res))
            .catch(err => console.log(err)); 
        } 
    });

    
});


