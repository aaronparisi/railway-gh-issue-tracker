import { useEffect, useState } from 'react';
import './stylesheets/App.css';

import Sidebar from './components/Sidebar';
import Repository from './components/Repository';

function App() {
  const [repos, setRepos] = useState({});
  const [selectedRepo, setSelectedRepo] = useState({});

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // fetch repo information
    console.log('fetching repo data from server...');
    fetch(`${apiUrl}/all-data`)
      .then((res) => res.json())
      .then((json) => {
        setRepos(json);
        setSelectedRepo(Object.keys(json)[0]);

        console.log('done fetching repo data');
        return json;
      });
  }, []);

  return (
    <div className="App">
      <header>
        <h1>
          Git Issue Tracker for user:{' '}
          <a href="https://www.github.com/railway-aaron-parisi">
            railway-aaron-parisi
          </a>{' '}
        </h1>
        <span>
          (read about it{' '}
          <a href="https://blog.aaronparisi.dev/gh-issue-tracker">here</a>)
        </span>
      </header>
      <section>
        <Sidebar
          repoNames={Object.keys(repos)}
          selectedRepo={selectedRepo}
          setSelectedRepo={setSelectedRepo}
        />
        <Repository
          issues={repos[selectedRepo]?.issues || []}
          repository={selectedRepo}
        />
      </section>
    </div>
  );
}

export default App;
