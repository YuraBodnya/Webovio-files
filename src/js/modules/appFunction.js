// Бургер Function ===============================================================================
export const burgerMenuFunction = () => {
   const burgerBtn = document.querySelector('.burger-wrapper');
   const bodyHtml = document.querySelector('body');
   const toggleBurgerMenu = (e) => {
      burgerBtn.removeEventListener('click', toggleBurgerMenu);
      setTimeout(function () {
         burgerBtn.addEventListener('click', toggleBurgerMenu);
      },timeout)
      if (bodyHtml) {
         if (unlock) {
            bodyLock();
         } else {
            bodyUnlock();
         }
         bodyHtml.classList.toggle('_active-burger');
         document.body.classList.toggle('lock');
      }
   }
   if (burgerBtn) {
      burgerBtn.addEventListener('click', toggleBurgerMenu);
   }
};
// ===============================================================================================



// Плавно убрать скрол============================================================================
let unlock = true;
const timeout = 300; // Время анимации
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lockPadding'); // Всех фиксированым объектам
function bodyLock() {
   const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
   if (lockPadding.length > 0) {
      for (let i = 0; i < lockPadding.length; i++) {
         const el = lockPadding[i];
         el.style.paddingRight = lockPaddingValue;
      }
   }
   let header = document.querySelector('.header');
   header.style.paddingRight = lockPaddingValue;
   // body.style.paddingRight = lockPaddingValue;
   body.classList.add('lock');
   unlock = false;
   setTimeout(function () {
      unlock = true;
   }, timeout);
}
function bodyUnlock() {
   setTimeout(function () {
      if (lockPadding.length > 0) {
         for (let i = 0; i < lockPadding.length; i++) {
            const el = lockPadding[i];
            el.style.paddingRight = '0px';
         }
      }
      let header = document.querySelector('.header');
      header.style.paddingRight = '0px';
      // body.style.paddingRight = '0px';
      body.classList.remove('lock');
   }, timeout);
   unlock = false;
   setTimeout(function () {
      unlock = true;
   }, timeout);
}
// ===============================================================================================
// При клике unlock body==========================================================================
export const unlocBodyFuncRun = () => {
   const burgerMenu = document.querySelector('.burger-menu');
   const scrollToElement = (e) => {
      const target = e.target.closest('.burger-menu__link');
      if (target) {
         document.querySelector('body').classList.toggle('_active-burger');
      }
   }
   if (burgerMenu) {
      burgerMenu.addEventListener('click', scrollToElement);
   }
}
//================================================================================================



// Динамический адаптив===========================================================================
class DynamicAdapt {
   constructor(type) {
      this.type = type;
   }

   init() {
      // массив объектов
      this.оbjects = [];
      this.daClassname = '_dynamic_adapt_';
      // массив DOM-элементов
      this.nodes = [...document.querySelectorAll('[data-da]')];

      // наполнение оbjects объктами
      this.nodes.forEach((node) => {
         const data = node.dataset.da.trim();
         const dataArray = data.split(',');
         const оbject = {};
         оbject.element = node;
         оbject.parent = node.parentNode;
         оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
         оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
         оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
         оbject.index = this.indexInParent(оbject.parent, оbject.element);
         this.оbjects.push(оbject);
      });

      this.arraySort(this.оbjects);

      // массив уникальных медиа-запросов
      this.mediaQueries = this.оbjects
         .map(({
            breakpoint
         }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
         .filter((item, index, self) => self.indexOf(item) === index);

      // навешивание слушателя на медиа-запрос
      // и вызов обработчика при первом запуске
      this.mediaQueries.forEach((media) => {
         const mediaSplit = media.split(',');
         const matchMedia = window.matchMedia(mediaSplit[0]);
         const mediaBreakpoint = mediaSplit[1];

         // массив объектов с подходящим брейкпоинтом
         const оbjectsFilter = this.оbjects.filter(
            ({
               breakpoint
            }) => breakpoint === mediaBreakpoint
         );
         matchMedia.addEventListener('change', () => {
            this.mediaHandler(matchMedia, оbjectsFilter);
         });
         this.mediaHandler(matchMedia, оbjectsFilter);
      });
   }

   // Основная функция
   mediaHandler(matchMedia, оbjects) {
      if (matchMedia.matches) {
         оbjects.forEach((оbject) => {
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
         });
      } else {
         оbjects.forEach(
            ({ parent, element, index }) => {
               if (element.classList.contains(this.daClassname)) {
                  this.moveBack(parent, element, index);
               }
            }
         );
      }
   }

   // Функция перемещения
   moveTo(place, element, destination) {
      element.classList.add(this.daClassname);
      if (place === 'last' || place >= destination.children.length) {
         destination.append(element);
         return;
      }
      if (place === 'first') {
         destination.prepend(element);
         return;
      }
      destination.children[place].before(element);
   }

   // Функция возврата
   moveBack(parent, element, index) {
      element.classList.remove(this.daClassname);
      if (parent.children[index] !== undefined) {
         parent.children[index].before(element);
      } else {
         parent.append(element);
      }
   }

   // Функция получения индекса внутри родителя
   indexInParent(parent, element) {
      return [...parent.children].indexOf(element);
   }

   // Функция сортировки массива по breakpoint и place 
   // по возрастанию для this.type = min
   // по убыванию для this.type = max
   arraySort(arr) {
      if (this.type === 'min') {
         arr.sort((a, b) => {
            if (a.breakpoint === b.breakpoint) {
               if (a.place === b.place) {
                  return 0;
               }
               if (a.place === 'first' || b.place === 'last') {
                  return -1;
               }
               if (a.place === 'last' || b.place === 'first') {
                  return 1;
               }
               return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
         });
      } else {
         arr.sort((a, b) => {
            if (a.breakpoint === b.breakpoint) {
               if (a.place === b.place) {
                  return 0;
               }
               if (a.place === 'first' || b.place === 'last') {
                  return 1;
               }
               if (a.place === 'last' || b.place === 'first') {
                  return -1;
               }
               return b.place - a.place;
            }
            return b.breakpoint - a.breakpoint;
         });
         return;
      }
   }
}
export const da = new DynamicAdapt("max");
// ===============================================================================================



// Popup==========================================================================================
class Popup{
   constructor(timeout) {
      this.unlock = true;
      this.timeout = timeout;
      this.popupLinks = document.querySelectorAll('.popup-link');
      this.body = document.querySelector('body');
      this.lockPadding = document.querySelectorAll('.lock-padding');
      this.popup = document.querySelectorAll('.popup');
   }
   init() {
      // Клик на ссылки открытие Popup
      if (this.popupLinks.length > 0) {
         [...this.popupLinks].forEach(el => {
            el.addEventListener('click', this.getDataLinks.bind(this));
         }) 
      }
      // Клик закрытие Popup
      if (this.popup.length > 0) {
         [...this.popup].forEach(el => {
            el.addEventListener('click', this.popupClose.bind(this));
         })
      }
      if (this.popupLinks.length > 0) {
         document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
               if (document.querySelector('.popup._open')) {
                  document.querySelector('.popup._open').classList.remove('_open');
                  this.bodyUnlock();
               }
            }
         })
      }
   }
   // Получаем из Href ID popup которое открыть
   getDataLinks(e) {
      const popupName = e.target.closest('.popup-link').getAttribute('href').replace('#', '');
      const curentPopup = document.querySelector(`#${popupName}`);
      this.popupOpen(curentPopup);
   }
   // Открываем текущий Popup
   popupOpen(curentPopup) {
      if (curentPopup && this.unlock) {
         const popupActive = document.querySelector('.popup._open');
         if (popupActive) {
            this.popupClose(popupActive, false)
         } else {
            this.bodyLock();
         }
         curentPopup.classList.add('_open');
      }
   }
   // Закрываем текущий Popup
   popupClose(e,  doUnlock = true) {
      const curentTarget = e.target;
      if (this.unlock) {
         if (curentTarget.classList.contains('popup__close') || curentTarget.classList.contains('popup__body')) {
            curentTarget.closest('.popup').classList.remove('_open');
            this.bodyUnlock();
            e.preventDefault();
         }
      }
   }
   // Добавить padding на body и на element с классом .lock-padding (position: fixed)
   bodyLock() {
      const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
      if (this.lockPadding.length > 0) {
         this.lockPadding.forEach(el => {
            el.style.paddingRight = lockPaddingValue;
         })
      }
      this.body.style.paddingRight = lockPaddingValue;
      this.body.classList.add('lock');
      this.unlock = false;
      setTimeout(() => {
         this.unlock = true;
      }, this.timeout)
   }
   // Убрать padding на body и на element с классом .lock-padding (position: fixed)
   bodyUnlock() {
      setTimeout(() => {
         if (this.lockPadding.length > 0) {
            this.lockPadding.forEach(el => {
               el.style.paddingRight = '0px';
            })
         }
         this.body.style.paddingRight = '0px';
         this.body.classList.remove('lock');
      }, this.timeout)
      this.unlock = false;
      setTimeout(() => {
         this.unlock = true;
      }, this.timeout)

   }
}
export const popup = new Popup(800);
//================================================================================================



// Анимация при скролле===========================================================================
// ! anim-no-hide class для анимации 1 раз
class AnimItems {
   constructor(selector) {
      this.animItems = document.querySelectorAll(selector);
   }
   init() {
      if (this.animItems.length > 0) {
         this.animOnScroll();
         window.addEventListener('scroll', this.animOnScroll.bind(this));
      }
   }
   animOnScroll() {
      this.animItems.forEach(el => {
         const animItemHeight = el.offsetHeight; // ? Возращает высоту с отступами
         const animItemOffset = this.offset(el).top;
         const animStart = 2;
         let animItemPoint = window.innerHeight - animItemHeight / animStart;

         if (animItemHeight > window.innerHeight) {
            animItemPoint = window.innerHeight - window.innerHeight / animStart;
         }

         if ((scrollY > animItemOffset - animItemPoint) && scrollY < (animItemOffset + animItemHeight)) { 
            el.classList.add('item-animate');
         } else {
            if (!el.classList.contains('anim-no-hide')) { // ! Добавить класс если анимация 1 раз
               el.classList.remove('item-animate');
            }
         }

      })
   }
   offset(el) {
      const rect = el.getBoundingClientRect();
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      return {
         top: rect.top + scrollTop,
         left: rect.left + scrollLeft
      }
   }
}
export const anim = new AnimItems('[data-animation]');
//================================================================================================