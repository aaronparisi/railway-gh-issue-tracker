import React, { useEffect } from 'react';

import Issue from './Issue';

const Repository = ({ issues, setIssues, repository }) => {
  useEffect(() => {
    if (!issues && repository !== '') {
      fetch(`http://localhost:8080/issues?repo=${repository}`)
        .then((res) => res.json())
        .then((json) => {
          debugger;
          setIssues((prev) => {
            return {
              ...prev,
              [repository]: json,
            };
          });
        })
        .catch((err) => {
          console.error(
            'Error fetching issues for repository: ',
            repository,
            err
          );
        });
    }
  });

  return (
    <section className="repository">
      <h2>Issues</h2>
      <ul>
        {issues &&
          issues.map((issue) => {
            return <Issue key={issue.name} issue={issue} />;
          })}
      </ul>
    </section>
  );
};

export default Repository;
