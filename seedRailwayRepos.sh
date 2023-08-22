#!/bin/bash

if [ $# -ne 2 ]; then
  echo "Usage: $0 <github-username> <github-auth-token>"
  exit 1
fi

gh_user=$1
gh_auth_token=$2

labels=("bug" "documentation" "duplicate" "enhancement" "good first issue" "help wanted" "invalid" "question" "wontfix")
threshold=100

repos=$(gh repo list $gh_user --json name -q '.[].name')

# delete existing repos
for repo in $repos; do
  gh repo delete $gh_user/$repo --yes
done

# seed
for x in {1..10}; do
  gh repo create "repo$x" --private -d "Repo No. $x"
  # create repo issues
  for y in {1..10}; do
    selected_labels=()

    for label in "${labels[@]}"; do
      random_number=$(awk -v seed="$RANDOM" 'BEGIN{srand(seed);print rand()}')

      if (( $(echo "$random_number < 0.5" | bc -l) )); then
        selected_labels+=("$label")
      fi
    done

    labels_json=$(printf '"%s",' "${selected_labels[@]}")
    labels_json="[${labels_json%,}]"
    echo "labels_json: $labels_json"

    echo "creating issue $y"
    # TODO remove hard-coded token!!!!
    response=$(curl -i -L \
      -X POST \
      -H "Accept: application/vnd.github+json" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      -H "Authorization: Bearer $gh_auth_token" \
      https://api.github.com/repos/$gh_user/repo$x/issues \
      -d "{\"title\":\"Issue No. $y\",\"body\":\"blah blah blah\",\"assignee\":\"$gh_user\",\"labels\":$labels_json}")

    headers=$(echo "$response" | awk 'BEGIN{RS="\r\n\r\n"} NR==1')
    limit=$(echo "$headers" | grep -i '^x-ratelimit-limit:' | awk '{print $2}')
    remaining=$(echo "$headers" | grep -i '^x-ratelimit-remaining:' | awk '{print $2}' | sed -e 's/[[:space:]]*$//')
    reset_timestamp=$(echo "$headers" | grep -i '^x-ratelimit-reset:' | awk '{print $2}' | sed -e 's/[[:space:]]*$//')
    current_timestamp=$(date +%s)
    time_until_reset=$((reset_timestamp - current_timestamp))

    echo "remaining: $remaining"
    if [ $remaining -le $threshold ]; then
      echo "sleeping..."
      sleep "$time_until_reset"
      echo "... done sleeping"
    fi

    body=$(echo "$response" | awk 'BEGIN{RS="\r\n\r\n"} NR>1')
    issue_url=$(echo "$body" | jq -r '.url')
    issue_number=$(echo "$issue_url" | sed 's#.*/##')
    echo "issue_number: $issue_number"
    if [ $((RANDOM % 3)) -eq 0 ]; then
      echo "issue '$issue_url' randomly selected; closing it."
      gh issue close -R https://api.github.com/$gh_user/repo$x $issue_number
    fi
    echo "---"
  done
done
