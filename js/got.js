const got = document.querySelector('.got');
let profiles = [];

const createProfile = (detail) => {
    const profile = document.createElement('div');
    profile.classList.add('got__pic', 'flex', 'flex-col', 'items-center');

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
    profiles = data;
    console.log(profiles);
    profiles.forEach((profile, idx) => {
        if (idx < 48) {     
            createProfile(profile);
        }
    });
});

