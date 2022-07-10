
class FormValidation {
   constructor(selector) {
      this.form = document.querySelector(`#${selector}`);
      this.fields = null;
      this.btnSubmit = null;
      this.validationArr = [];
      this.reg = {
         name: /^[a-zA-Zа-яА-Я]{3,20}$/,
         city: /^[a-zA-Zа-яА-Я- ]{3,20}$/,
         email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
         no: /./
      }
   }
   init() {
      this.fields = this.form.querySelectorAll('.field-form');
      this.btnSubmit = this.form.querySelector('input[type="submit"]');
      this.btnSubmit.addEventListener('click', this.validationAllField.bind(this));
      if (this.fields.length > 0) {
         this.fields.forEach(el => {
            el.querySelector('.field-form__input').addEventListener('blur', this.validationField.bind(this));
            el.querySelector('.field-form__input').addEventListener('input', this.validationField.bind(this));
         })
      }
   }
   validationField(e) {
      const fieldValue = e.target.value.trim();
      const validationName = e.target.dataset.validation;
      const errorEl = e.target.nextElementSibling;
      if (this.reg[validationName].test(fieldValue)) {
         errorEl.innerHTML = 'Looks good!';
         errorEl.classList.remove('incorrect-validation');
         errorEl.classList.add('correct-validation');
         this.validationArr = this.validationArr.filter(el => el !== e.target.parentElement);
      }
      else {
         errorEl.classList.remove('correct-validation');
         errorEl.classList.add('incorrect-validation');
         if (!this.validationArr.find(el => el === e.target.parentElement)) {
            this.validationArr.push(e.target.parentElement);
         }
         if (e.target.dataset.error) {
            errorEl.innerHTML = `${e.target.dataset.error}`;
         }
         else {
            errorEl.innerHTML = 'incorrect';
         }
      }
   }
   validationAllField(e) {
      if (this.fields.length > 0) {
         this.fields.forEach(el => {
            const inputField = el.querySelector('.field-form__input');
            const inputFieldValue = inputField.value.trim();
            const validationName = inputField.dataset.validation;
            const errorEl = inputField.nextElementSibling;
            if (this.reg[validationName].test(inputFieldValue)) {
               errorEl.innerHTML = 'Looks good!';
               errorEl.classList.remove('incorrect-validation');
               errorEl.classList.add('correct-validation');
               this.validationArr = this.validationArr.filter(el => el !== inputField.parentElement);
            }
            else {
               errorEl.classList.remove('correct-validation');
               errorEl.classList.add('incorrect-validation');
               if (!this.validationArr.find(el => el === inputField.parentElement)) {
                  this.validationArr.push(inputField.parentElement);
               }
               if (inputField.dataset.error) {
                  errorEl.innerHTML = `${inputField.dataset.error}`;
               }
               else {
                  errorEl.innerHTML = 'incorrect';
               }
            }
         })
      }
      if (this.validationArr.length === 0 ) {
         const fieldsArr = [];
         this.fields.forEach(el => {
            const element = el.querySelector('.field-form__input');
            const field = {
               fieldName: element.id,
               value: element.value
            }
            fieldsArr.push(field);
            element.value = '';
            element.nextElementSibling.classList.remove('correct-validation');
         })
         this.showResult(fieldsArr);
      }
      e.preventDefault();
   }

   showResult(fieldsArr) {
      const popup = document.querySelectorAll('.popup');
      const popupResult = document.querySelector('#popupResult');
      const popupContent = popupResult.querySelector('.popup__text');
      popup.forEach(el => {
         if (el.classList.contains('_open')){
            el.classList.remove('_open');
         }
      })
      setTimeout(() => {
         popupResult.classList.add('_open');
      }, 301)
      fieldsArr = fieldsArr.map(el=>`
         <p>${el.fieldName}: ${el.value}</p>
      `)
      popupContent.innerHTML = fieldsArr.join('');
   }
}

export const formValidationFeedback = new FormValidation('form-feedback');
export const formValidationStarted = new FormValidation('form-started');
