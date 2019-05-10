let repos = [];

const getRepos = () => {
  fetch("https://api.github.com/users/alexander-berezhnoy/repos", {
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
    .then(console.log)
    .catch(err => {
      console.log(err);
    });
};
