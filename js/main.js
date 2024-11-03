"use strict";


const isMobile = {
   Android: function () {
      return navigator.userAgent.match(/Android/i);
   },
   BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
   },
   iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
   },
   Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
   },
   Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
   },
   any: function () {
      return (
         isMobile.Android() ||
         isMobile.BlackBerry() ||
         isMobile.iOS() ||
         isMobile.Opera() ||
         isMobile.Windows()
      );
   }
};

// Gallery
const mainGallery = document.querySelector('.gallery__body');
if (mainGallery && !isMobile.any()) {
   const galleryItems = document.querySelector('.gallery__items');
   const galleryColumn = document.querySelectorAll('.gallery__column');

   // Скорость анимации
   const speed = mainGallery.dataset.speed;

   // объявление переменных
   let positionX = 0;
   let coordXprocent = 0;

   function setMouseGalleryStyle() {
      let galleryItemsWidth = 0;
      galleryColumn.forEach(element => {
         galleryItemsWidth += element.offsetWidth;
      });

      const galleryDifferent = galleryItemsWidth - mainGallery.offsetWidth;
      const distX = Math.floor(coordXprocent - positionX);

      positionX = positionX + (distX * speed);
      let position = galleryDifferent / 200 * positionX;

      galleryItems.style.cssText = `transform: translate3d(${-position}px,0,0);`;

      if (Math.abs(distX) > 0) {
         requestAnimationFrame(setMouseGalleryStyle);
      } else {
         mainGallery.classList.remove('_init');
      }
   }

   mainGallery.addEventListener('mousemove', function (e) {
      // Получение ширины
      const galleryWidth = mainGallery.offsetWidth;

      // Ноль по середине
      const coordX = e.pageX - galleryWidth / 2;

      // Получаем проценты
      coordXprocent = coordX / galleryWidth * 200;

      if (!mainGallery.classList.contains('_init')) {
         requestAnimationFrame(setMouseGalleryStyle);
         mainGallery.classList.add('_init');
      }
   });
}

let reviewsSwiper = document.querySelector('.reviews__slider');
if (reviewsSwiper) {
   const swiper = new Swiper('.reviews__slider', {
      loop: true,
      slidesPerView: 1,
      effect: "fade",
      autoHeight: true,
      speed: 500,
      grabCursor: true,
      autoplay: {
         delay: 3000,
         disableOnInteraction: false,
         pauseOnMouseEnter: true,
      },
      pagination: {
         clickable: true,
         el: '.swiper-pagination',
      },
   });
}
// МЕНЮ БУРГЕР
let menu = document.querySelector('.icon-menu');
let menuBody = document.querySelector('.menu__body');
menu.addEventListener('click', function () {
   document.body.classList.toggle('_lock');
   menu.classList.toggle('_active');
   menuBody.classList.toggle('_active');
});

// ЛИПКИЙ HEADER
let header = document.querySelector('.header');

document.onscroll = function () {
   let scroll = window.scrollY;
   if (scroll > 0){
      header.classList.add('_fixed');
   } else {
      header.classList.remove('_fixed');
   }
}
// ТАБЫ
const tabs = document.querySelectorAll('[data-tabs]');
if (tabs.length > 0) {
   tabs.forEach((tabsBlock, index) => {
      tabsBlock.classList.add('_tab-init');
      tabsBlock.setAttribute('data-tabs-index', index);
      tabsBlock.addEventListener("click", setTabsAction);
      initTabs(tabsBlock);
   });

   // Получение слойлеров с медиа запросами
   let mdQueriesArray = dataMediaQueries(tabs, "tabs");
   if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach(mdQueriesItem => {
         // Событие
         mdQueriesItem.matchMedia.addEventListener("change", function () {
            setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
         });
         setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
   }
}
// Установка позиций заголовков
function setTitlePosition(tabsMediaArray, matchMedia) {
   tabsMediaArray.forEach(tabsMediaItem => {
      tabsMediaItem = tabsMediaItem.item;
      let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
      let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
      let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
      let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
      tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems.forEach((tabsContentItem, index) => {
         if (matchMedia.matches) {
            tabsContent.append(tabsTitleItems[index]);
            tabsContent.append(tabsContentItem);
            tabsMediaItem.classList.add('_tab-spoller');
         } else {
            tabsTitles.append(tabsTitleItems[index]);
            tabsMediaItem.classList.remove('_tab-spoller');
         }
      });
   });
}
// Работа с контентом
function initTabs(tabsBlock) {
   let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
   let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');

   const tabsBlockIndex = tabsBlock.dataset.tabsIndex;

   if (tabsContent.length) {
      tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
         tabsTitles[index].setAttribute('data-tabs-title', '');
         tabsContentItem.setAttribute('data-tabs-item', '');

         if (tabsBlock.hasAttribute("data-tabs-contacts")) {
            if (!tabsTitles[index].classList.contains('_tab-active')) {
               tabsContentItem.classList.remove('_tab-active');
            } else {
               tabsContentItem.classList.add('_tab-active');
            }
         } else {
            tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
         }
      });
   }
}
function setTabsStatus(tabsBlock) {
   let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
   let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');

   const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
   function isTabsAnamate(tabsBlock) {
      if (tabsBlock.hasAttribute('data-tabs-animate')) {
         return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
      }
   }
   const tabsBlockAnimate = isTabsAnamate(tabsBlock);
   if (tabsContent.length > 0) {
      tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
         if (tabsTitles[index].classList.contains('_tab-active')) {
            if (tabsBlockAnimate) {
               _slideDown(tabsContentItem, tabsBlockAnimate);
            } else {
               if (tabsBlock.hasAttribute("data-tabs-contacts")) { 
                  tabsContentItem.classList.add('_tab-active');
               } else {
                  tabsContentItem.hidden = false;
               }
            }
         } else {
            if (tabsBlockAnimate) {
               _slideUp(tabsContentItem, tabsBlockAnimate);
            } else {
               if (tabsBlock.hasAttribute("data-tabs-contacts")) { 
                  tabsContentItem.classList.remove('_tab-active');
               } else {
                  tabsContentItem.hidden = true;
               }
            }
         }
      });
   }
}
function setTabsAction(e) {
   const el = e.target;
   if (el.closest('[data-tabs-title]')) {
      const tabTitle = el.closest('[data-tabs-title]');
      const tabsBlock = tabTitle.closest('[data-tabs]');
      if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
         let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
         tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock) : null;
         tabActiveTitle.length ? tabActiveTitle[0].classList.remove('_tab-active') : null;
         tabTitle.classList.add('_tab-active');
         setTabsStatus(tabsBlock);
      }
      e.preventDefault();
   }
}

// Вспомогательные модули плавного расскрытия и закрытия объекта ===========================================
let _slideUp = (target, duration = 500, h = 0) => { 
   if (!target.classList.contains('_slide') && !target.classList.contains('_showmore')) {
      target.classList.add('_slide');
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = target.offsetHeight + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => { 
         target.hidden = true;
         target.style.removeProperty('height');
         target.style.removeProperty('padding-top');
         target.style.removeProperty('padding-bottom');
         target.style.removeProperty('margin-top');
         target.style.removeProperty('margin-bottom');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('_slide');
      }, duration);
   } else {
      target.classList.add('_slide');
      target.style.transitionProperty = 'height';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = h + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = h + 'px';
      window.setTimeout(() => { 
         target.classList.remove('_slide');
      }, duration);
   }
}
let _slideDown = (target, duration = 500, h = 0) => { 
   if (!target.classList.contains('_slide') && !target.classList.contains('_showmore')) {
      target.classList.add('_slide');
      if (target.hidden) {
         target.hidden = false;
      }
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      window.setTimeout(() => { 
         target.style.removeProperty('height');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('_slide');
      }, duration);
   } else {
      target.classList.add('_slide');
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = h + 'px';
      target.style.transitionProperty = 'height';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = h + 'px';
      window.setTimeout(() => { 
         target.classList.remove('_slide');
      }, duration);
   }
}
let _slideToggle = (target, duration = 500, h = 0) => { 
   if (target.hidden) {
      return _slideDown(target, duration, h);
   } else {
      return _slideUp(target, duration, h);
   }
}
let _slideRemove = (target, duration = 500, h = 0) => {
   target.style.removeProperty('height');
   target.style.removeProperty('overflow');
   target.style.removeProperty('transition-duration');
   target.style.removeProperty('transition-property');
}
// Обработа медиа запросов из атрибутов 
function dataMediaQueries(array, dataSetValue) {
	// Получение объектов с медиа запросами
	const media = Array.from(array).filter(function (item, index, self) {
		if (item.dataset[dataSetValue]) {
			return item.dataset[dataSetValue].split(",")[0];
		}
	});
	// Инициализация объектов с медиа запросами
	if (media.length) {
		const breakpointsArray = [];
		media.forEach(item => {
			const params = item.dataset[dataSetValue];
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});
		// Получаем уникальные брейкпоинты
		let mdQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mdQueries = uniqArray(mdQueries);
		const mdQueriesArray = [];

		if (mdQueries.length) {
			// Работаем с каждым брейкпоинтом
			mdQueries.forEach(breakpoint => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);
				// Объекты с нужными условиями
				const itemsArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				mdQueriesArray.push({
					itemsArray,
					matchMedia
				})
			});
			return mdQueriesArray;
		}
	}
}
// Уникализация массива
function uniqArray(array) {
	return array.filter(function (item, index, self) {
		return self.indexOf(item) === index;
	});
}
// POPUP
const popupLinks = document.querySelectorAll('[data-popup]');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll("[data-lp]");

let unlock = true;

const timeout = 800;

if (popupLinks.length > 0) {
   for (let index = 0; index < popupLinks.length; index++){
      const popupLink = popupLinks[index];
      popupLink.addEventListener("click", function (e) {
         const popupName = popupLink.dataset.popup;
         const curentPopup = document.getElementById(popupName);
         popupOpen(curentPopup);
         e.preventDefault();
      });
   }
}
const popupCloseIcon = document.querySelectorAll('[data-close]');
if (popupCloseIcon.length > 0) {
   for (let index = 0; index < popupCloseIcon.length; index++){
      const el = popupCloseIcon[index];
      el.addEventListener('click', function (e) {
         popupClose(el.closest('.popup'));
         e.preventDefault();
      });
   }
}

function popupOpen(curentPopup) {
   if (curentPopup && unlock) {
      const popupActive = document.querySelector('.popup._open');
      if (popupActive) {
         popupClose(popupActive, false);
      } else {
         bodyLock();
      }
      curentPopup.classList.add('_open');
      curentPopup.addEventListener("click", function (e) {
         if (!e.target.closest('.popup__content')) {
            popupClose(e.target.closest('.popup'));
         }
      });
   }
}
function popupClose(popupActive, doUnlock = true) {
   if (unlock) {
      popupActive.classList.remove('_open');
      if (doUnlock) {
         bodyUnLock();
      }
   }
}

function bodyLock() {
   const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

   if (lockPadding.length > 0) {

      for (let index = 0; index < lockPadding.length; index++) {
         const el = lockPadding[index];

         el.style.paddingRight = lockPaddingValue;
      }
   }   
   body.style.paddingRight = lockPaddingValue;
   body.classList.add('_lock');

   unlock = false;
   setTimeout(function () {
      unlock = true;
   }, timeout);
}

function bodyUnLock() {
   setTimeout(function () {
      if (lockPadding.length > 0) {
         for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = '0px';
         }
      }   
      body.style.paddingRight = '0px';
      body.classList.remove('_lock');
   }, timeout);

   unlock = false;
   setTimeout(function () {
      unlock = true;
   }, timeout);
}

document.addEventListener('keydown', function (e) {
   if (e.which === 27) {
      const popupActive = document.querySelector('.popup._open');
      popupClose(popupActive);
   }
});

(function () {
   // проверяем поддержку
   if (!Element.prototype.closest) {
      // реализуем
      Element.prototype.closest = function (css) {
         var node = this;
         while (node) {
            if (node.matches(css)) return node;
            else node = node.parentElement;
         }
         return null;
      }
   }
})();
(function () {
   // проверяем поддержку
   if (!Element.prototype.matches) {
      // определяем свойство
      Element.prototype.matches = Element.prototype.matchesSelector ||
         Element.prototype.webkitMatchesSelector ||
         Element.prototype.mozMatchesSelector ||
         Element.prototype.msMatchesSelector;
   }
})();
const animItems = document.querySelectorAll('._anim-items');
if (animItems.length > 0) {
   window.addEventListener('scroll', animOnScroll);
   function animOnScroll() {
      for (let index = 0; index < animItems.length; index++){
         const animItem = animItems[index];
         const animItemHeight = animItem.offsetHeight;
         const animItemOffset = offset(animItem).top + 300;
         const animStart = 4;

         let animItemPoint = window.innerHeight - animItemHeight / animStart;
         if (animItemHeight > window.innerHeight) {
            animItemPoint = window.innerHeight - window.innerHeight / animStart;
         }

         if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < ((animItemOffset - 300) + animItemHeight)) {
            animItem.classList.add('_active');
         } else {
            if (!animItem.classList.contains('_anim-no-hide')) {
               animItem.classList.remove('_active');
            }
         }
      }
   }
   function offset(el) {
      const rect = el.getBoundingClientRect(),
         scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
         scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
   }

   setTimeout(() => {
      animOnScroll();
   }, 300);
}