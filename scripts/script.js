let btn = document.querySelector(".btn-search");
let input = document.querySelector('input[type="text"]');

const getRepos = () => {
  clearRepos();
  const ownerUrl = `https://api.github.com/users/${input.value}/repos`;
  fetch(ownerUrl, {
    method: "GET",
    headers: { "content-type": "application/json" }
  })
    .then(response => response.json())
    .then(parsedData => {
      return parsedData.map(repo => {
        const { name, description, fork, language } = repo;
        const stars = repo.stargazers_count;
        const updated = repo.updated_at;
        return {
          name,
          description,
          fork,
          stars,
          updated,
          language
        };
      });
    })
    .then(repos => {
      drawCards(repos);
    })
    .catch(err => {
      console.log(err);
    });
};

btn.addEventListener("click", getRepos);

const drawCards = repos => {
  let wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  document.body.insertBefore(wrapper, document.body.nextSibling);
  repos.forEach(repo => {
    let card = document.createElement("div");
    card.className = repo.fork ? "card fork" : "card source";

    let name = createRepoName(repo.name);
    card.appendChild(name);

    let description = createRepoDescription(repo.description);
    card.appendChild(description);

    let infoRow = createRepoInfo(repo);
    card.appendChild(infoRow);

    wrapper.appendChild(card);
  });
};

const createRepoName = name => {
  let repo_name = document.createElement("h4");
  repo_name.className = "repo-name";
  repo_name.innerText = name;
  return repo_name;
};

const createRepoDescription = descr => {
  let description = document.createElement("p");
  description.className = "repo-description";
  description.innerText = descr;
  return description;
};

const createRepoInfo = repo => {
  let repoInfo = document.createElement("div");
  repoInfo.className = "repo-info";

  repoInfo.appendChild(createRepoLanguage(repo.language));
  repoInfo.appendChild(createRepoStarCount(repo.stars));

  repoInfo.appendChild(createRepoIsFork(repo.fork));
  repoInfo.appendChild(createRepoUpdated(repo.updated));
  return repoInfo;
};

const createRepoLanguage = lang => {
  let language = document.createElement("div");
  language.className = "info-item language";
  language.innerText = lang;
  return language;
};

const createRepoStarCount = stars => {
  let starsCount = document.createElement("div");
  starsCount.className = "info-item stars";
  starsCount.innerHTML = `<i class="fas fa-star"></i><span class="star-count">${stars}</span>`;
  return starsCount;
};

const createRepoIsFork = isFork => {
  let fork = document.createElement("div");
  fork.className = "info-item fork";
  fork.innerHTML = isFork
    ? '<i class="fas fa-code-branch"></i><i class="fas fa-check">'
    : '<i class="fas fa-code-branch"></i> <i class="fas fa-times">';
  return fork;
};

const createRepoUpdated = updated => {
  let updatedAt = document.createElement("div");
  updatedAt.className = "info-item updated";
  const date = new Date(updated);
  const hours = addLeadingZero(date.getHours());
  const minutes = addLeadingZero(date.getMinutes());
  const days = addLeadingZero(date.getDate());
  const month = addLeadingZero(date.getMonth() + 1);
  updatedAt.innerText = `${hours}:${minutes} ${days}.${month}.${date.getFullYear()}`;
  return updatedAt;
};

const addLeadingZero = num => {
  return num < 10 ? `0${num}` : `${num}`;
};

//remove wrapper element
const clearRepos = () => {
  const oldWrapper = document.querySelector(".wrapper");
  if (oldWrapper) {
    oldWrapper.parentNode.removeChild(oldWrapper);
  }
};

const typeFilter = document.getElementById("type-select");
const cards = document.getElementsByClassName("card");

typeFilter.addEventListener(
  "change",
  function() {
    const choosedType = this.value;
    switch (choosedType) {
      case "forks": {
        filterCardsByType("fork");
        break;
      }
      case "sources": {
        filterCardsByType("source");
        break;
      }
      case "all":
      default: {
        resetHideClass();
      }
    }
  },
  false
);

const filterCardsByType = filterClass => {
  resetHideClass();
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].className.indexOf(filterClass) == -1) {
      cards[i].classList.add("hide");
    }
  }
};

const resetHideClass = () => {
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.remove("hide");
  }
};
/* Star count filter */
const starFilter = document.getElementById("star-filter");
const stars = document.getElementsByClassName("star-count");

const filterByStars = () => {
  resetHideClass();
  const minStars = +starFilter.value;
  for (let i = 0; i < cards.length; i++) {
    if (minStars > +stars[i].innerText) {
      cards[i].classList.add("hide");
    }
  }
};

starFilter.addEventListener("change", filterByStars, false);

/* Repo name sort */
const nameOrder = document.getElementById("name-order");
const nameSortBtn = document.getElementById("name-sort");

const render = nodes => {
  clearRepos();
  let wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  document.body.insertBefore(wrapper, document.body.nextSibling);
  for (let j = 0; j < nodes.length; j++) {
    wrapper.appendChild(nodes[j]);
  }
};

const sortByName = () => {
  let sortedCards = [];
  for (let i = 0; i < cards.length; i++) {
    sortedCards.push(cards[i]);
  }
  if (nameSortBtn.className.includes("asc")) {
    //ascending sort
    sortedCards.sort((a, b) => {
      const nameA = a
        .getElementsByClassName("repo-name")[0]
        .innerText.toLowerCase();
      const nameB = b
        .getElementsByClassName("repo-name")[0]
        .innerText.toLowerCase();
      let result = 0;
      if (nameA < nameB) result = -1;
      if (nameA > nameB) result = 1;
      return result;
    });
    nameSortBtn.classList.remove("asc");
    nameSortBtn.classList.add("desc");
    nameOrder.classList.remove("fa-caret-up");
    nameOrder.classList.add("fa-caret-down");
    render(sortedCards);
  } else {
    //descending sort
    sortedCards.sort((a, b) => {
      const nameA = a
        .getElementsByClassName("repo-name")[0]
        .innerText.toLowerCase();
      const nameB = b
        .getElementsByClassName("repo-name")[0]
        .innerText.toLowerCase();
      let result = 0;
      if (nameA > nameB) result = -1;
      if (nameA < nameB) result = 1;
      return result;
    });
    nameSortBtn.classList.remove("desc");
    nameSortBtn.classList.add("asc");
    nameOrder.classList.remove("fa-caret-down");
    nameOrder.classList.add("fa-caret-up");
    render(sortedCards);
  }
};

nameSortBtn.addEventListener("click", sortByName);

/* Star count sort */
const starsOrder = document.getElementById("star-order");
const starsSortBtn = document.getElementById("star-sort");

const sortByStars = () => {
  let sortedCards = [];
  for (let i = 0; i < cards.length; i++) {
    sortedCards.push(cards[i]);
  }
  if (starsSortBtn.className.includes("asc")) {
    //ascending sort
    sortedCards.sort((a, b) => {
      const countA = +a.getElementsByClassName("star-count")[0].innerText;
      const countB = +b.getElementsByClassName("star-count")[0].innerText;
      let result = 0;
      if (countA < countB) result = -1;
      if (countA > countB) result = 1;
      return result;
    });
    starsSortBtn.classList.remove("asc");
    starsSortBtn.classList.add("desc");
    starsOrder.classList.remove("fa-caret-up");
    starsOrder.classList.add("fa-caret-down");
    render(sortedCards);
  } else {
    //descending sort
    sortedCards.sort((a, b) => {
      const countA = +a.getElementsByClassName("star-count")[0].innerText;
      const countB = +b.getElementsByClassName("star-count")[0].innerText;
      let result = 0;
      if (countA > countB) result = -1;
      if (countA < countB) result = 1;
      return result;
    });
    starsSortBtn.classList.remove("desc");
    starsSortBtn.classList.add("asc");
    starsOrder.classList.remove("fa-caret-down");
    starsOrder.classList.add("fa-caret-up");
    render(sortedCards);
  }
};

starsSortBtn.addEventListener("click", sortByStars);
