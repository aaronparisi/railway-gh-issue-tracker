import React from 'react';

import '../stylesheets/Sidebar.css';

const Sidebar = ({ repoNames, selectedRepo, setSelectedRepo }) => {
  const handleRepoSelection = (repo) => {
    setSelectedRepo(repo);
  };

  return (
    <section className="sidebar">
      <h2>Repositories</h2>
      <ul>
        {repoNames.map((repoName) => {
          return (
            <li
              key={repoName}
              className={repoName === selectedRepo ? 'selected' : ''}
              onClick={() => {
                handleRepoSelection(repoName);
              }}
            >
              {repoName}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Sidebar;
