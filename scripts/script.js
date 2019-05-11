const getRepos = () => {
  fetch("https://api.github.com/users/gothinkster/repos", {
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

const drawCards = repos => {
  let wrapper = document.querySelector(".wrapper");
  repos.forEach(repo => {
    let card = document.createElement("div");
    card.className = "card";

    let name = createRepoName(repo.name);
    card.appendChild(name);

    let description = createRepoDescription(repo.description);
    card.appendChild(description);

    let infoRow = createRepoInfo(repo);
    card.appendChild(infoRow);

    wrapper.appendChild(card);
  });
};

getRepos();

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
  return repoInfo;
  // repoInfo.appendChild(createRepoIsFork(repo.fork));
  // repoInfo.appendChild(createRepoUpdated(repo.updated));
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
  starsCount.innerHTML = `<i class="fas fa-star"></i>${stars}`;
  return starsCount;
};
/*
<div class="card">
      <h4 class="repo-name">realworld</h4>
      <p class="repo-description">
        "The mother of all demo apps" — Exemplary fullstack Medium.com clone
        powered by React, Angular, Node, Django, and many more
      </p>
      <div class="repo-info">
        <div class="info-item language">JavaScript</div>
        <div class="info-item stars"><i class="fas fa-star"></i>25.6k</div>
        <div class="info-item fork">
          <i class="fas fa-code-branch"></i> <i class="fas fa-check"></i>
        </div>
        <div class="info-item updated">11.05.2019</div>
      </div>
    </div>

*/
