import "../assets/styles/styles.scss"
import "./form.scss";

const form = document.querySelector('form');
const errorElement = document.querySelector('#errors');
const buttonCancel = document.querySelector('.btn-secondary');
let errors = [];

buttonCancel.addEventListener('click', () => {
    location.assign('./index.html');
});

form.addEventListener('submit', async event => {
    event.preventDefault();

    const formData = new FormData(form);
    const article = Object.fromEntries(formData.entries());
    if(formIsValid(article)) {
        try {
            const json = JSON.stringify(article);
            const response  =  await fetch("https://restapi.fr/api/littlefoots", {
                method : "POST",
                body: json,
                headers : {
                    'Content-Type' : 'application/json'
                }
            });
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