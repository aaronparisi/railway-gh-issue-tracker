import React from 'react';

import '../stylesheets/Sidebar.css';

const Sidebar = ({ repos, selectedRepo, setSelectedRepo }) => {
  const handleRepoSelection = (repo) => {
    setSelectedRepo(repo);
  };

  return (
    <section className="sidebar">
      <h2>Repositories</h2>
      <ul>
        {repos.map((repo) => {
          return (
            <li
              key={repo.name}
              className={repo.name === selectedRepo ? 'selected' : ''}
              onClick={() => {
                handleRepoSelection(repo.name);
              }}
            >
              {repo.name}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Sidebar;
