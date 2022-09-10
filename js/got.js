const got = document.querySelector('.got__map');
const sidebar = document.querySelector('.got__sidebar');
const charInfoPlaceholder = document.querySelector('.got__char-info_placeholder');
const searchDiv = document.querySelector('.got__search');

const modal = document.querySelector('.got__modal');
const closeModalX = document.querySelector('.modal__close-btn');
const modalCharInfoPlaceholder = document.querySelector('.modal__char-info_placeholder');
const modalSearchDiv = document.querySelector('.modal__search');

let profiles = [];

const createProfile = (detail) => {
    const profile = document.createElement('div');
    profile.classList.add('got__pic', 'flex', 'flex-col', 'items-center');
    profile.id = detail.name.replace(' ', '');
    profile.onclick = () => {
        if (window.innerWidth < 600) {
            modal.classList.remove("hidden-transition");
            modal.classList.add("visible-transition");
            closeModalX.focus();
        }
        selectProfile(detail, profile);
        showSearchInputError(false);
    }

    const profileImg = document.createElement('img');
    profileImg.classList.add('img-size');
    profileImg.src = detail.portrait;
    profile.appendChild(profileImg);

    const profileName = document.createElement('div');
    profileName.classList.add('img-name', 'text-center');
    profileName.innerHTML = detail.name;
    profile.appendChild(profileName);

    got.appendChild(profile);
};

const createCharInfo = (detail) => {
    const charInfo = document.createElement('div');
    charInfo.classList.add('got__char-info', 'flex', 'flex-col', 'items-center');

    const charImg = document.createElement('img');
    charImg.classList.add('char-img');
    if (!detail.picture) {
        charImg.classList.add('char-img--default');
    }
    charImg.src = detail.picture ? detail.picture : detail.portrait;
    charInfo.appendChild(charImg);

    const charShortInfo = document.createElement('div');
    charShortInfo.classList.add('char-short', 'flex', 'items-center', 'justify-between', 'w-full');
    charInfo.appendChild(charShortInfo);

    const charName = document.createElement('div');
    charName.classList.add('char-name');
    charName.innerHTML = detail.name;
    charShortInfo.appendChild(charName);

    const charHouse = document.createElement('img');
    charHouse.classList.add('char-house');
    charHouse.src = detail.house ? `assets/houses/${detail.house}.png` : 'assets/houses/no-house.svg';
    charShortInfo.appendChild(charHouse);

    const charBio = document.createElement('div');
    charBio.classList.add('char-bio');
    charBio.innerHTML = detail.bio;
    charInfo.appendChild(charBio);

    charInfoPlaceholder.appendChild(charInfo);
    modalCharInfoPlaceholder.appendChild(charInfo.cloneNode(true));
};

const selectProfile = (detail, profileHtmlEl) => {
    const prevActiveEl = document.querySelector('.got__pic--active');
    if (prevActiveEl) {
        prevActiveEl.classList.remove('got__pic--active');
    };
    profileHtmlEl.classList.add('got__pic--active');
    deleteCharInfo();
    createCharInfo(detail);
};

const deleteCharInfo = () => {
    const charInfoArr = document.querySelectorAll('.got__char-info');
    if (charInfoArr.length) {
        charInfoArr[0].remove();
        charInfoArr[1].remove();
    }
};

(function createSearch() {
    const htmlObj = {};
    /* Ez ezért kell, mert az eventListener-eket nem clone-ozza a cloneNode */
    for (let i = 1; i < 3; i++) {
        const htmlObjSearchInputDiv = `searchInputDiv${i}`;
        htmlObj[htmlObjSearchInputDiv] = document.createElement('div');
        htmlObj[htmlObjSearchInputDiv].classList.add('flex', 'items-center', 'justify-evenly');

        const htmlObjSearchInput = `searchInput${i}`;
        htmlObj[htmlObjSearchInput] = document.createElement('input');
        htmlObj[htmlObjSearchInput].classList.add('search-input');
        htmlObj[htmlObjSearchInput].type = 'text';
        htmlObj[htmlObjSearchInput].placeholder = 'Search a character';
        htmlObj[htmlObjSearchInput].onfocus = () => showSearchInputError(false);

        const htmlObjSearchBtn = `searchBtn${i}`;
        htmlObj[htmlObjSearchBtn] = document.createElement('button');
        htmlObj[htmlObjSearchBtn].classList.add('search-btn');
        htmlObj[htmlObjSearchBtn].innerHTML = '❯';
        htmlObj[htmlObjSearchBtn].onclick = () => {
            if (htmlObj[htmlObjSearchInput].value) {
                findProfile(htmlObj[htmlObjSearchInput].value);
                htmlObj[htmlObjSearchInput].value = '';
            }
        }

        const htmlObjErrorDiv = `errorDiv${i}`;
        htmlObj[htmlObjErrorDiv] = document.createElement('div');
        htmlObj[htmlObjErrorDiv].classList.add('search-error', 'flex', 'items-center', 'justify-center');
        htmlObj[htmlObjErrorDiv].innerHTML = 'Character not found';

        htmlObj[htmlObjSearchInputDiv].appendChild(htmlObj[htmlObjSearchBtn]);
        htmlObj[htmlObjSearchInputDiv].appendChild(htmlObj[htmlObjSearchInput]);
    }

    searchDiv.appendChild(htmlObj['searchInputDiv1']);
    searchDiv.appendChild(htmlObj['errorDiv1']);
    modalSearchDiv.appendChild(htmlObj['searchInputDiv2']);
    modalSearchDiv.appendChild(htmlObj['errorDiv2']);
})();

const findProfile = (searchStr) => {
    const searchedProfile = profiles.filter(profile => profile.name.toLowerCase() === searchStr.toLowerCase());
    if (searchedProfile.length) {
        const activatedProfile = document.querySelector(`#${searchedProfile[0].name.replace(' ', '')}`);
        selectProfile(searchedProfile[0], activatedProfile);
    } else {
        showSearchInputError();
    }
};

const showSearchInputError = (show = true) => {
    const errorDivArr = document.querySelectorAll('.search-error');
    show
        ? (() => {
            errorDivArr[0].classList.add('search-error--on');
            errorDivArr[1].classList.add('search-error--on');
        })()
        : (() => {
            errorDivArr[0].classList.remove('search-error--on');
            errorDivArr[1].classList.remove('search-error--on');
        })();
};

async function request(url, options = {}) {
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
};

request('./json/got.json').then((data) => {
    profiles = data
        .filter(item => !item.dead)
        .sort((a, b) => {
            const aArr = a.name.split(' ');
            const bArr = b.name.split(' ');
            const aLastName = aArr[aArr.length - 1];
            const bLastName = bArr[bArr.length - 1];
            let result = aLastName > bLastName ? 1 : aLastName < bLastName ? -1 : 0;
            if (!result) {
                const aFirstName = aArr[0];
                const bFirstName = bArr[0];
                result = aFirstName > bFirstName ? 1 : aFirstName < bFirstName ? -1 : 0;
            }

            return result;
        });
    profiles.forEach((profile, idx) => {
        if (idx < 48) {
            createProfile(profile);
        }
    });
});

// Modal starts here

closeModalX.onclick = function () {
    modal.classList.remove("visible-transition");
    modal.classList.add("hidden-transition");
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.classList.remove("visible-transition");
        modal.classList.add("hidden-transition");
    }
};

window.onresize = function () {
    if (window.innerWidth > 599) {
        modal.classList.remove("visible-transition");
        modal.classList.add("hidden-transition");
    }
};