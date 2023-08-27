import React from 'react';

import '../stylesheets/Issues.css';
import Issue from './Issue.jsx';

const Issues = ({ issues, repository }) => {
  return (
    <section className="issues">
      <h2>
        Issues for <a href={repository.url}>{repository.name}</a>
      </h2>
      <ul>
        {issues &&
          issues.map((issue) => {
            return <Issue key={issue.title} issue={issue} />;
          })}
      </ul>
    </section>
  );
};

export default Issues;
