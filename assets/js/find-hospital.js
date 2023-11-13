const accordionHeaders = document.querySelectorAll('.accordion__header');

function accordion(target) {
  target.classList.toggle('accordion__header--active');
  target.nextElementSibling.classList.toggle('accordion__content--show');
}

for(let $i = 0; $i < accordionHeaders.length; $i++) {
  let accordionHeader = accordionHeaders[$i];
  accordionHeader.addEventListener('click', () => {
    accordion(accordionHeader);
  });
}