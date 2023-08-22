#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <github-username>"
  exit 1
fi

github_user=$1

labels=("bug" "documentation" "duplicate" "enhancement" "good first issue" "help wanted" "invalid" "question" "wontfix")

repos=$(gh repo list $github_user --json name -q '.[].name')

# delete existing repos
for repo in $repos; do
  gh repo delete $github_user/$repo --yes
done

# seed
for x in {1..10}; do
  gh repo create "repo$x" --private -d "Repo No. $x"
  sleep 1

  # create repo issues
  for y in {1..10}; do
    selected_labels_string=""

    for label in "${labels[@]}"; do
      if (( RANDOM % 2 == 0 )); then
        selected_labels_string+="$label,"
      fi
    done

    # Remove the trailing comma
    selected_labels_string="${selected_labels_string%,}"
    echo "selected labels: $selected_labels_string"

    # NOTE GraphQL secondary rate limits are an issue.
    #      Basically I can't seed the repos over and over or I get locked out
    issue_url=$(gh issue create -R $github_user/repo$x -a @me -t "Issue No. $y" -b "blah blah blah" -l "$selected_labels_string")
    echo "---- created issue: $issue_url"
    echo "---- sleeping for 5 seconds"
    sleep 5

    if [ $((RANDOM % 3)) -eq 0 ]; then
      echo "issue '$issue_url' randomly selected; closing it."
      gh issue close $issue_url
    fi
  done

  sleep 1  # just to be safe
done
