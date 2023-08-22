import { useEffect, useState } from 'react';
import './stylesheets/App.css';

import Sidebar from './components/Sidebar';
import Repository from './components/Repository';

function App() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState({});
  const [issues, setIssues] = useState({});

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/repos`)
      .then((res) => res.json())
      .then((json) => {
        setRepos(json);
        setSelectedRepo(json[0]);

        return json;
      });
  }, []);

  useEffect(() => {
    if (selectedRepo.name) {
      fetch(`${apiUrl}/issues?repo=${selectedRepo.name}`)
        .then((res) => res.json())
        .then((json) => {
          setIssues((prev) => {
            return {
              ...prev,
              [selectedRepo.name]: json,
            };
          });
        })
        .catch((err) => {
          console.error(
            'Error fetching issues for repository: ',
            selectedRepo.name,
            err
          );
        });
    }
  }, [selectedRepo.name]);

  return (
    <div className="App">
      <header>
        <h1>Git Issue Tracker for user: TODO </h1>
      </header>
      <section>
        <Sidebar
          repos={repos}
          selectedRepo={selectedRepo}
          setSelectedRepo={setSelectedRepo}
        />
        <Repository
          issues={issues[selectedRepo.name]}
          repository={selectedRepo}
        />
      </section>
    </div>
  );
}

export default App;
