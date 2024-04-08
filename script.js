'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const tabContainer = document.querySelector('.operations__tab-container');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');
const menu = document.querySelector('.burger-menu');


const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////

btnScrollTo.addEventListener('click',(e) => {
  const s1coords = section1.getBoundingClientRect();
  window.scrollTo({
    left:window.scrollX + s1coords.left,
    top: window.scrollY + s1coords.top,
    behavior:'smooth'});
});

navLinks.addEventListener('click', e => {
  e.preventDefault();
  if(!e.target.classList.contains('nav__link')) return;
  const section = e.target.getAttribute('href');
  const s1coords = document.querySelector(section).getBoundingClientRect();
  window.scrollTo({
    left:window.scrollX + s1coords.left,
    top: window.scrollY + s1coords.top,
    behavior:'smooth'});
});

const handleMouseOver = function(e) {
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    
    const logo = link.closest('.nav').querySelector('img');
    const title = link.closest('.nav').querySelector('#title');
    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
    title.style.opacity = this;
  }

}

nav.addEventListener('mouseover', handleMouseOver.bind(0.5));
nav.addEventListener('mouseout', handleMouseOver.bind(1));

const navHeight = nav.getBoundingClientRect().height;

const obsCallback = function (entries) {
 const [entry] = entries;
 console.log();
 if(!entry.isIntersecting){
  nav.classList.add('sticky');
 } else {
  nav.classList.remove('sticky');
 }
};

const obsOption = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
}

const observer = new IntersectionObserver(obsCallback, obsOption);
observer.observe(header);

const showSection = function(entries, observer) {
  const [entry] = entries;
  entry.isIntersecting 
  && entry.target.classList.remove('section--hidden')
  && observer.unobserve(entry.target); 
};

const sectionObserver = new IntersectionObserver(showSection, {
  root: null,
  threshold:0.15
});


allSections.forEach(el => {
  sectionObserver.observe(el);
  el.classList.add('section--hidden');
});


tabContainer.addEventListener('click', function(e) {
  const btns = document.querySelectorAll('.btn.operations__tab');
  btns.forEach(btn => btn.classList.remove('operations__tab--active'));
  e.target.closest('.btn').classList.add('operations__tab--active');
  const operContainer = document.querySelectorAll('.operations__content');
  operContainer.forEach(el => el.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${e.target.dataset.tab}`).classList.add('operations__content--active');
});


const showImg = function(entries) {
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', ()=>{
    entry.target.classList.remove('lazy-img');
  });
  

}

const imgObserver = new IntersectionObserver(showImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(el => {
  imgObserver.observe(el);
});


const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

slides.forEach((slide, i) => slide.style.transform = `translateX(${100 * i}%)`);
let currentIndex = 0;

const maxIndex = slides.length-1;

const goToSlide = slide => {
  slides.forEach((el,i) => el.style.transform = `translateX(${100*(i-slide)}%)`);
};

const nextSlide= () => {
  currentIndex === maxIndex ? currentIndex = 0: currentIndex++;
  goToSlide(currentIndex);
  activeDot(currentIndex);
};

const prevSlide = () => { 
  currentIndex === 0 ? currentIndex = maxIndex : currentIndex--;
  goToSlide(currentIndex);
  activeDot(currentIndex);
}

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', e => {
e.key === 'ArrowRight' && nextSlide();
e.key === 'ArrowLeft' && prevSlide();
});

const dotContainer = document.querySelector('.dots');

const createDots = () => {
  slides.forEach((_,i) => {
    dotContainer.insertAdjacentHTML('beforeend',
    `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

dotContainer.addEventListener('click', e => {
  const dotBtn = e.target;
  console.log(dotBtn.dataset.slide)
  if(dotBtn.classList.contains('dots__dot')){
    currentIndex = Number(dotBtn.dataset.slide)
    goToSlide(currentIndex);
    activeDot(currentIndex);
  }
  
})

const activeDot = (slide) => {
  const dots = document.querySelectorAll('.dots__dot');
  dots.forEach(el => el.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
};
activeDot(0);

const footerCopy = document.querySelector('.footer__copyright');
footerCopy.innerText = new Date().getFullYear();

function redirectToHomePage() {
  window.scrollTo(0, 0); // Scroll to the top of the page
}

menu.addEventListener('click', function(e) {
  const navLinks = document.querySelector('.nav__links');
  navLinks.classList.toggle('burger-links');
  window.addEventListener('click', function(e){
    if(!e.target.classList.contains('line') || e.target.classList.contains('burger-menu')){
      navLinks.classList.remove('burger-links');
    }
  })
})

// Add event listener for unload event
window.addEventListener('unload', redirectToHomePage);

