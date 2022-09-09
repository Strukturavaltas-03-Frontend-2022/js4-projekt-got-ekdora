const got = document.querySelector('.got__map');
const sidebar = document.querySelector('.got__sidebar');
const charInfoPlaceholder = document.querySelector('.got__char-info_placeholder');
const searchDiv = document.querySelector('.got__search');
let profiles = [];
let searchHasError = false;

const createProfile = (detail) => {
    const profile = document.createElement('div');
    profile.classList.add('got__pic', 'flex', 'flex-col', 'items-center');
    profile.onclick = () => selectProfile(detail, profile);

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
    charShortInfo.classList.add('flex', 'items-center', 'justify-between', 'w-full');
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
    const charInfo = document.querySelector('.got__char-info');
    if (charInfo) {
        charInfo.remove();
    }
};

(function createSearch() {
    const searchInputDiv = document.createElement('div');
    searchInputDiv.classList.add('flex', 'items-center', 'justify-evenly');

    const searchInput = document.createElement('input');
    searchInput.classList.add('search-input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search a character';
    searchInput.onfocus = () => showSearchInputError(false);

    const searchBtn = document.createElement('button');
    searchBtn.classList.add('search-btn');
    searchBtn.innerHTML = '❯';
    searchBtn.onclick = () => {
        if (searchInput.value) {
            findProfile(searchInput.value);
            searchInput.value = '';
        }
    }

    const errorDiv = document.createElement('div');
    errorDiv.classList.add('search-error', 'flex', 'items-center', 'justify-center');
    errorDiv.innerHTML = 'Character not found';

    searchInputDiv.appendChild(searchBtn);
    searchInputDiv.appendChild(searchInput);
    searchDiv.appendChild(searchInputDiv);
    searchDiv.appendChild(errorDiv);
})();

const findProfile = (searchStr) => {
    const searchedProfile = profiles.filter(profile => profile.name.toLowerCase() === searchStr.toLowerCase());
    if (searchedProfile.length) {
        const profileHtmlEls = document.querySelectorAll('.got__pic');
        let isFound = false;
        let activatedProfile;
        for (let i = 0; i < profileHtmlEls.length && !isFound; i++) {
            activatedProfile = profileHtmlEls[i];
            isFound = activatedProfile.querySelector('.img-name').innerHTML.toLowerCase() === searchStr.toLowerCase();
        };

        selectProfile(searchedProfile[0], activatedProfile);
    } else {
        showSearchInputError();
    }
};

const showSearchInputError = (show = true) => {
    const errorDiv = document.querySelector('.search-error');
    show ? errorDiv.classList.add('search-error--on') : errorDiv.classList.remove('search-error--on');
    
}

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

