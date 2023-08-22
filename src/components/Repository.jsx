import React from 'react';

import '../stylesheets/Repository.css';
import Issue from './Issue.jsx';

const Repository = ({ issues, repository }) => {
  return (
    <section className="repository">
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

export default Repository;
