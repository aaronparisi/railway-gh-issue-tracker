import React from 'react';

import '../stylesheets/Issue.css';

const Issue = ({ issue }) => {
  return (
    <div className="issue">
      <h3>
        <a href={issue.url}>{issue.title}</a> | State: {issue.state}
      </h3>
      <p>{issue.body}</p>
      <h4>Labels:</h4>
      <section className="labels-list">
        {issue.labels.map((label) => (
          <li
            className={`label label-${label.name.split(' ').join('-')}`}
            key={label.name}
          >
            {label.name}
          </li>
        ))}
      </section>
    </div>
  );
};

export default Issue;

// note: I made 'labels-list' a <section> to avoid <ul> default styling.
//       probably a css reset would be a better approach.
