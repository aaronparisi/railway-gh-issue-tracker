import React from 'react';

import '../stylesheets/Issue.css';

const Issue = ({ issue }) => {
  return (
    <div className="issue">
      <h3>
        <a href={issue.url}>{issue.title}</a>
      </h3>
      <p>{issue.body}</p>
      <p>{issue.state}</p>
      <ul>
        {issue.labels.map((label) => (
          <li key={label.name}>{label.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Issue;
