'use strict';

const dropdownDefault = document.querySelector('.dropdown-lists__list--default'),
   dropdownColDefault = dropdownDefault.querySelector('.dropdown-lists__col'),
   dropdownSelect = document.querySelector('.dropdown-lists__list--select'),
   dropdownColSelect = dropdownSelect.querySelector('.dropdown-lists__col'),
   dropdownAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
   dropdownColAutocomplete = dropdownAutocomplete.querySelector('.dropdown-lists__col'),
   selectCities = document.getElementById('select-cities'),
   btnGo = document.querySelector('.button'),
   closeButton = document.querySelector('.close-button'),
   main = document.querySelector('.main');

dropdownDefault.style.position = "relative";
dropdownSelect.style.position = "relative";

let dataCountrys;

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

      dropdownAnimate(dropdownDefault);

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
      dropdownDefault.style.display = 'none';
      dropdownAutocomplete.style.display = 'none';
      dropdownSelect.style.display = 'block';
      dropdownAnimate(dropdownSelect);

      let target = event.target;
      target = target.closest('.dropdown-lists__total-line');
      if (target) {
         const countrySelect = target.querySelector('.dropdown-lists__country');

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
      closeButton.style.display = 'block';
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

   const dropdownAnimate = (dropdown) => {
      let deleteInterval,
         animate = false,
         count = 100;

      const deleteAnimate = () => {
         deleteInterval = requestAnimationFrame(deleteAnimate);
         count -= 4;
         if (count >= 0 && dropdown.matches('.dropdown-lists__list--default')) {
            dropdown.style.left = `${count}%`;
         } else if (count >= 0 && dropdown.matches('.dropdown-lists__list--select')) {
            dropdown.style.right = `${count}%`;
         } else {
            cancelAnimationFrame(deleteInterval);
         }
      };
      if (!animate) {
         deleteInterval = requestAnimationFrame(deleteAnimate);
         animate = true;
      } else {
         cancelAnimationFrame(deleteInterval);
         animate = false;
         count = 0;
      }
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

const loader = (local) => {
   const statusLoad = document.createElement('section');
   statusLoad.classList.add('main');
   statusLoad.style.color = '#fff';
   statusLoad.style.fontSize = '2em';
   statusLoad.style.alignItems = 'center';
   const preload = `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="500px" height="500px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
         <g transform="rotate(0 50 50)">
      <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#00416a">
         <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
      </rect>
      </g><g transform="rotate(30 50 50)">
      <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#00416a">
         <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
      </rect>
      </g><g transform="rotate(60 50 50)">
      <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#00416a">
         <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
      </rect>
      </g><g transform="rotate(90 50 50)">
      <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#00416a">
         <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
      </rect>
      </g><g transform="rotate(120 50 50)">
      <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#00416a">
         <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
      </rect>
      </g><g transform="rotate(150 50 50)">
      <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#00416a">
         <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
      </rect>
      </g><g transform="rotate(180 50 50)">
      <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#00416a">
         <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
      </rect>
      </g><g transform="rotate(210 50 50)">
      <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#00416a">
         <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
      </rect>
      </g><g transform="rotate(240 50 50)">
      <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#00416a">
         <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
      </rect>
      </g><g transform="rotate(270 50 50)">
      <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#00416a">
         <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
      </rect>
      </g><g transform="rotate(300 50 50)">
      <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#00416a">
         <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
      </rect>
      </g><g transform="rotate(330 50 50)">
      <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#00416a">
         <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
      </rect>
      </g>
      `,
      errorLoad = 'Что-то пошло не так...';
   statusLoad.innerHTML = preload;
   main.style.display = 'none';
   document.body.appendChild(statusLoad);
   setTimeout(() => {
      if (localStorage.dataDefault) {
         cityData(JSON.parse(localStorage.dataDefault), local);
         main.style.display = 'flex';
         document.body.removeChild(statusLoad);
      } else {
         getData(statusLoad, errorLoad, local);
      }
   }, 1000);
};

const getData = (statusLoad, errorLoad, local) => {
   fetch('./db_cities.json', {
      method: 'GET',
      mode: 'cors',
      body: JSON.stringify()
   })
      .then(response => {
         if (response.status !== 200) {
            throw new Error('status network not 200');
         }
         return (response.json());
      })
      .then((data) => {
         filterCountrys(data, local);
      })
      .catch(error => {
         statusLoad.textContent = errorLoad;
         console.log(error);
      });
};

const setCookie = (key, value, year, month, day, path, domain, secure) => {
   let cookieStr = `${encodeURI(key)}=${encodeURI(value)}`;
   if (year) {
      const expires = new Date(year, month - 1, day);
      cookieStr += `; expires=${expires.toGMTString()}`
   }
   cookieStr += path ? `; path=${encodeURI(path)}` : '';
   cookieStr += domain ? `; domain=${encodeURI(domain)}` : '';
   cookieStr += secure ? '; secure' : '';

   document.cookie = cookieStr;
};

const getCookie = () => {
   const cookie = document.cookie.split('=');
   let localCookie;
   if (!cookie[1]) {
      localCookie = prompt('Введите локаль (RU, EN или DE)', 'RU');
      if (localCookie) {
         setCookie('local', localCookie.trim().toUpperCase());
      }
      delete localStorage.dataDefault;
      getCookie();
   } else {
      if (localCookie && (localCookie === 'RU' || localCookie !== 'EN' || localCookie !== 'DE')) {
         setCookie('local', localCookie.trim().toUpperCase());
         delete localStorage.dataDefault;
         loader(cookie[1]);
      } else if (localCookie && (localCookie !== 'RU' || localCookie === 'EN' || localCookie !== 'DE')) {
         setCookie('local', localCookie.trim().toUpperCase());
         delete localStorage.dataDefault;
         loader(cookie[1]);
      } else if (localCookie && (localCookie !== 'RU' || localCookie !== 'EN' || localCookie === 'DE')) {
         setCookie('local', localCookie.trim().toUpperCase());
         delete localStorage.dataDefault;
         loader(cookie[1]);
      } else if (cookie[1] === 'RU' || cookie[1] === 'EN' || cookie[1] === 'DE') {
         loader(cookie[1]);
      } else {
         localCookie = prompt('Введите локаль (RU, EN или DE)', 'RU');
         setCookie('local', localCookie.trim().toUpperCase());
         delete localStorage.dataDefault;
         getCookie();
      }
   }
};

const addLocalStorage = (local) => {
   if (local.length !== 0) {
      localStorage.dataDefault = JSON.stringify(local);
      loader();
   } else {
      delete localStorage.dataDefault;
   }
};

const filterCountrys = (dataDefault, local) => {
   let localCountry;
   let othersCountry;

   for (let key in dataDefault) {
      if (key === local) {
         if (local === 'RU') {
            localCountry = dataDefault[key].filter(item => {
               return item.country === "Россия";
            });
            othersCountry = dataDefault[key].filter(item => {
               return item.country !== "Россия";
            });
         }
         if (local === 'EN') {
            localCountry = dataDefault[key].filter(item => {
               return item.country === "United Kingdom";
            });
            othersCountry = dataDefault[key].filter(item => {
               return item.country !== "United Kingdom";
            });
         }
         if (local === 'DE') {
            localCountry = dataDefault[key].filter(item => {
               return item.country === "Deutschland";
            });
            othersCountry = dataDefault[key].filter(item => {
               return item.country !== "Deutschland";
            });
         }
      }
   }
   const newCountry = localCountry.concat(othersCountry);
   addLocalStorage(newCountry);
};

getCookie();