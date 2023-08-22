import { useEffect, useState } from 'react';
import './stylesheets/App.css';

import Sidebar from './components/Sidebar';
import Repository from './components/Repository';

function App() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [issues, setIssues] = useState({});

  useEffect(() => {
    fetch('http://localhost:8080/repos')
      .then((res) => res.json())
      .then((json) => {
        setRepos(json);
        setSelectedRepo(json[0].name); // do I want this feature?

        return json;
      });
  }, []);

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
          issues={issues[selectedRepo]}
          setIssues={setIssues}
          repository={selectedRepo}
        />
      </section>
    </div>
  );
}

export default App;
