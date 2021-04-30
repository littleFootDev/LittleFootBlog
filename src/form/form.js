import "../assets/styles/styles.scss"
import "./form.scss";
import "../assets/javascript/modal.js";
import { openModal } from "../assets/javascript/modal.js";

const form = document.querySelector('form');
const errorElement = document.querySelector('#errors');
const buttonCancel = document.querySelector('.btn-secondary');
let articleId;
let errors = [];

const fillform = article => {
    const author = document.querySelector('input[name="author"]');
    const img = document.querySelector('input[name="img"]');
    const category = document.querySelector('input[name="category"]');
    const title = document.querySelector('input[name="title"]');
    const content = document.querySelector('textarea');

    author.value = article.author || '';
    img.value = article.img || '' ;
    category.value = article.category || '';
    title.value = article.title || '';
    content.value = article.content || '';

}

const initForm = async () => {
    const params = new URL(location.href);
    articleId = params.searchParams.get('id');
    
    if(articleId) {
        const response = await fetch(`https://restapi.fr/api/littlefoots/${articleId}`);
        if (response.status < 300) {
            const article = await response.json();
            console.log(article);
            fillform(article);
        }
    }
};

initForm();

buttonCancel.addEventListener('click', async () => {
    const result = await openModal('si vous quitter la page, vous allez perdre votre article!! ');
    if (result === true) {
        location.assign('./index.html');
    }
});

form.addEventListener('submit', async event => {
    event.preventDefault();

    const formData = new FormData(form);
    const article = Object.fromEntries(formData.entries());
    if(formIsValid(article)) {
        try {
            const json = JSON.stringify(article);
            let response
            if (articleId ) {
                response  =  await fetch(`https://restapi.fr/api/littlefoots/${articleId}`, {
                method : "PATCH",
                body: json,
                headers : {
                    'Content-Type' : 'application/json'
                  }
                });
            } else {
                response  =  await fetch("https://restapi.fr/api/littlefoots", {
                method : "POST",
                body: json,
                headers : {
                    'Content-Type' : 'application/json'
                  }
                });
            }
            if (response.status <299) {
                location.assign('./index.html');
            }
        } catch (e) {
            console.log('e : ', e);
        }
    }
});

const formIsValid = article => {
    errors = [];
    if(!article.author || !article.category || !article.content || !article.img || !article.title) {
        errors.push("vous devez renseigner tout les champs ");
    } else {
        errors = [];
    }
    if(errors.length) {
        let errortHTML = "";
        errors.forEach( (e) => {
            errortHTML += `<li>${e}</li>`
        });
        errorElement.innerHTML = errortHTML;
        return false
    } else {
        errorElement.innerHTML = "";
        return true
    }
}