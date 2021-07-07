'use strict';

const dropdownDefault = document.querySelector('.dropdown-lists__list--default'),
   dropdownColDefault = dropdownDefault.querySelector('.dropdown-lists__col'),
   dropdownSelect = document.querySelector('.dropdown-lists__list--select'),
   dropdownColSelect = dropdownSelect.querySelector('.dropdown-lists__col'),
   dropdownAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
   dropdownColAutocomplete = dropdownAutocomplete.querySelector('.dropdown-lists__col'),
   selectCities = document.getElementById('select-cities'),
   btnGo = document.querySelector('.button'),
   closeButton = document.querySelector('.close-button');

const { RU, EN, DE } = data;

const cityData = (dataDefault) => {

   const dataCitys = dataDefault.reduce((accum, item) => accum.concat(item.cities), []);

   const addCountry = (country, count) => {
      const countryCard = document.createElement('div');
      countryCard.classList.add('dropdown-lists__countryBlock');
      countryCard.innerHTML = `<div class="dropdown-lists__total-line">
                                 <div class="dropdown-lists__country">${country}</div>
                                 <div class="dropdown-lists__count">${count}</div>
                              </div>`;
      return countryCard;
   };

   const addCity = (city, count) => {
      const cityCard = document.createElement('div');
      cityCard.classList.add('dropdown-lists__line');
      cityCard.innerHTML = `<div class="dropdown-lists__city">${city}</div>
                              <div class="dropdown-lists__count">${count}</div>`;
      return cityCard;
   };

   const addClickCity = () => {
      const getAllCity = document.querySelectorAll('.dropdown-lists__city');
      getAllCity.forEach(item => {
         item.addEventListener('click', event => {
            // getAllCity.forEach(elem => elem.classList.remove('dropdown-lists__city--ip'));
            const target = event.target;
            if (target.closest('.dropdown-lists__city')) {
               dataCitys.forEach(city => {
                  if (city.name === target.textContent) {
                     btnGo.href = city.link;
                  }
               });
               // target.classList.add('dropdown-lists__city--ip');
               selectCities.value = target.textContent;
               closeButton.style.display = 'block';
               selectCities.focus();
            }
         });
      });
      selectCities.addEventListener('focus', initAutocomplete);
   };

   const addClickCountry = () => {
      const getAllCountry = document.querySelectorAll('.dropdown-lists__country');
      getAllCountry.forEach(item => {
         item.addEventListener('click', () => {
            selectCities.focus();
            selectCities.value = item.textContent;
            closeButton.style.display = 'block';
         });
      });
   };

   const initDefault = () => {
      dropdownColDefault.innerHTML = '';
      dropdownDefault.style.display = 'block';
      dropdownSelect.style.display = 'none';
      dropdownAutocomplete.style.display = 'none';

      dataDefault.forEach(item => {
         const countryCard = addCountry(item.country, item.count);
         dropdownColDefault.append(countryCard);
         let count = item.cities.filter(item => item.count).sort((a, b) => (b.count - a.count));
         count.slice(0, 3).forEach(city => {
            const cityCard = addCity(city.name, city.count);
            countryCard.append(cityCard);
         });
      });
      const dropdownTotalLine = dropdownColDefault.querySelectorAll('.dropdown-lists__total-line');
      dropdownTotalLine.forEach(item => item.addEventListener('click', initSelect));
      addClickCountry();
      addClickCity();
   };

   const initSelect = event => {
      dropdownColSelect.innerHTML = '';
      let target = event.target;
      target = target.closest('.dropdown-lists__total-line');
      if (target) {
         const countrySelect = target.querySelector('.dropdown-lists__country');
         dropdownDefault.style.display = 'none';
         dropdownAutocomplete.style.display = 'none';
         dropdownSelect.style.display = 'block';

         dataDefault.forEach(item => {
            if (countrySelect.textContent === item.country) {
               const countryCard = addCountry(item.country, item.count);
               dropdownColSelect.append(countryCard);

               item.cities.forEach(city => {
                  const cityCard = addCity(city.name, city.count);
                  countryCard.append(cityCard);
               });
            }
         });
         const dropdownTotalLine = dropdownColSelect.querySelectorAll('.dropdown-lists__total-line');
         dropdownTotalLine.forEach(item => item.addEventListener('click', initDefault));
      }
      addClickCity();
   };

   const initAutocomplete = () => {
      dropdownColAutocomplete.innerHTML = '';
      dropdownDefault.style.display = 'none';
      dropdownSelect.style.display = 'none';
      dropdownAutocomplete.style.display = 'block';
      if (selectCities.value) {
         const filterCitys = dataCitys.filter(item => item.name.toLowerCase().indexOf(selectCities.value.toLowerCase().trim()) > -1);
         if (filterCitys.length > 0) {
            filterCitys.forEach(city => {
               const cityCard = addCity(city.name, city.count);
               dropdownColAutocomplete.append(cityCard);
            });
         } else {
            dropdownColAutocomplete.textContent = 'Ничего не найдено';
         }
      } else {
         initDefault();
      }
      addClickCity();
   };

   selectCities.addEventListener('click', initDefault);
   selectCities.addEventListener('input', initAutocomplete);
   btnGo.addEventListener('click', (event) => {
      if (/#/.test(btnGo.href)) {
         event.preventDefault();
      } else {
         return;
      }
   });
   closeButton.addEventListener('click', () => {
      dropdownDefault.style.display = 'none';
      dropdownAutocomplete.style.display = 'none';
      dropdownSelect.style.display = 'none';
      closeButton.style.display = 'none';
      selectCities.value = '';
   });

};

cityData(RU);


