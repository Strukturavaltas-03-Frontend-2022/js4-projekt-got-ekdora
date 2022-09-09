const got = document.querySelector('.got__map');
const sidebar = document.querySelector('.got__sidebar');
const charInfoPlaceholder = document.querySelector('.got__char-info_placeholder');
const searchDiv = document.querySelector('.got__search');
let profiles = [];

const createProfile = (detail) => {
    const profile = document.createElement('div');
    profile.classList.add('got__pic', 'flex', 'flex-col', 'items-center');
    profile.onclick = () => {
        deleteCharInfo();
        createCharInfo(detail);
    };

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
    charInfo.classList.add('got__char-info');

    const charImg = document.createElement('img');
    charImg.classList.add('char-img');
    charImg.src = detail.picture;
    charInfo.appendChild(charImg);

    const charShortInfo = document.createElement('div');
    charShortInfo.classList.add('flex', 'justify-between');
    charInfo.appendChild(charShortInfo);

    const charName = document.createElement('div');
    charName.classList.add('char-name');
    charName.innerHTML = detail.name;
    charShortInfo.appendChild(charName);

    const charHouse = document.createElement('img');
    charHouse.classList.add('char-house');
    charHouse.src = `assets/houses/${detail.house}.png`;
    charShortInfo.appendChild(charHouse);

    const charBio = document.createElement('div');
    charBio.classList.add('char-bio');
    charBio.innerHTML = detail.bio;
    charInfo.appendChild(charBio);

    charInfoPlaceholder.appendChild(charInfo);
};

const deleteCharInfo = () => {
    const charInfo = document.querySelector('.got__char-info');
    if (charInfo) {
        charInfo.remove();
    }
};

(function createSearch() {
    const searchBtn =  document.createElement('button');
    searchBtn.classList.add('search-btn');
    searchBtn.innerHTML = '❯';
    searchDiv.appendChild(searchBtn);

    const searchInput = document.createElement('input');
    searchInput.classList.add('search-input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search a character';
    searchDiv.appendChild(searchInput);
})();

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

