#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <github-username>"
  exit 1
fi

# note: this is somewhat contrived:
#       the script executes GitHub CLI commands without any additional authorization
#       The CLI invocations in this script will only work if the CLI has been authorized
#       for the user.  Either:
#       1. hard-code the <github-username> in this shell script
#       2. reconfigure the script to make API calls with authentication tokens in headers,
#          foregoing the CLI altogether.
#       3. reconfigure the script to LOGIN with an auth token before executing any
#          additional CLI commands.  This would likely be my preferred refactor.  See:
#          https://cli.github.com/manual/gh_auth_login
github_user=$1

# note: this is also somewhat contrived.
#       The GitHub CLI does provide a mechanism for reading a repository's existing labels:
#       https://cli.github.com/manual/gh_label_list
#       However, I was running into the following:
#       - create a repo
#       - read the repo's labels
#       - create several repo issues, assigning each a subset of labels
#       The issue was that `gh label list` was returning different sets of labels.
#       I _think_ this was just a timing issue (I called `gh issue list` too soon after repo creation).
#       In any event, I decided a hard-coded string was fine for now since this whole thing is contrived...
#       FWIW, this approach also prevents the use of custom labels (https://cli.github.com/manual/gh_label_create)
labels=("bug" "documentation" "duplicate" "enhancement" "good first issue" "help wanted" "invalid" "question" "wontfix")

repos=$(gh repo list $github_user --json name -q '.[].name')

# note: this is DANGEROUS.  Honestly I should remove the `--yes` flag.
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

    # note: secondary rate limits are an issue. see discussion in https://blog.aaronparisi.dev/gh-issue-tracker
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
