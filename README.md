# Seeding the repos & issues

Before creating an issue tracking UI, I wanted to have a bunch of issues to track.

To house these repos and issues, I created a new GitHub user, [railway-aaron-parisi](https://github.com/railway-aaron-parisi).

My initial thought was to utilize the `create` subcommands for the GitHub CLI's [repo](https://cli.github.com/manual/gh_repo_create) and [issue](https://cli.github.com/manual/gh_issue_create) commands. Plan was to simply do a few loops in a shell script:

```bash
for x in {1..10}; do
  # create repo $x

  for y in {1..10}; do
    # create issue $y
  done
done
```

However, I began exceeding `GraphQL` rate limit with the `gh issue create` command.

My initial thought then was to monitor the rate limit status:

```bash
threshold=100
response=$(gh api -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /rate_limit) # this does not contribute to rate limits
remaining=$(echo "$response" | jq -r '.resources.graphql.remaining')
reset_timestamp=$(echo "$response" | jq -r '.resources.graphql.reset')
current_timestamp=$(date +%s)
time_until_reset=$((reset_timestamp - current_timestamp))

if ((remaining <= threshold)); then
  echo "sleeping..."
  sleep "$time_until_reset"
  echo "... done sleeping"
fi
```

I found, however, that I was still exceeding a `GraphQL` rate limit despite having quite a bit `remaining`. [This](https://github.com/cli/cli/discussions/6826) issue discusses a secondary rate limit for `GraphQL` requests, and [these](https://docs.github.com/en/graphql/overview/resource-limitations#rate-limit) docs indidate that the `GraphQL` rate limit is different than the REST API's rate limits, since a "single complex GraphQL call could be the equivalent of thousands of REST requests."

[This](https://github.com/cli/cli/issues/4774) issue indicates that a batch issue creation tool will not be made, and [this](https://github.com/cli/cli/issues/4801) issue further discusses rate limits and the information (or lack thereof) in API response headers.

Despite adding some `sleep` statements, I was still hitting `GraphQL` rate limit issues as I was trying to create 10 issues for each of 10 repos. One option would be to just admit that this is a toy app and increase the `sleep` duration or decrease the number of issues per repo, but I didn't want to do that.

My next thought was to try to avoid `GrpahQL` entirely by calling the [REST API Endpoint](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#create-an-issue) directly:

```bash
    issue_res=$(gh api /repos/$github_user/repo$x/issues -F title="Issue No. $y" -F body="blah blah blah" -F assignee="$github_user" -F labels=$selected_labels_string -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28")
```

where `selected_labels_string` is a random collection of comma-separated labels. The problem here is that, while `gh issue create` accepts a _string_ argument for its `-l` flag, `gh api -F labels=[...]` takes an _array_. I'm no `bash` wiz, and I couldn't figure out how to pass the labels. Attempts included:

```bash
    labels_json=$(printf '"%s"\n' "${labels[@]}" | jq -s .)
    echo $labels_json
```

The example provided by the [Create an Issue Docs](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#create-an-issue) utilized the `-d` flag as follows:

```bash
curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/OWNER/REPO/issues \
  -d '{"title":"Found a bug","body":"I'\''m having a problem with this.","assignees":["octocat"],"milestone":1,"labels":["bug"]}'
```

However, [gh api](https://cli.github.com/manual/gh_api) does not accept a `-d` flag.

So my next thought was to just forego the `gh` CLI altogether and make requests directly with `curl`... but at that point I wondered why I didn't just use JavaScript, which I'm more familiar with.

Mind you, I don't even know if that will work - clearly GitHub doesn't want me mass-creating issues, so I wonder if no matter what I do I'll be rate limited. TBD.

One additional note: the `curl` command prints the http response headers when the `-i` flag is provided. I was under the imporession that extracting the headers and the body into separate variables would be trivial, but [this](https://dille.name/blog/2021/09/13/processing-response-headers-and-body-at-once-using-curl/) and [this](https://stackoverflow.com/questions/25852524/get-both-the-headers-and-the-body-of-a-curl-response-in-two-separated-variables) suggest otherwise.

ChatGPT to the rescue though - after a number of iterations, it provided the following lines, which did what I wanted:

```bash
headers=$(echo "$response" | awk 'BEGIN{RS="\r\n\r\n"} NR==1')
body=$(echo "$response" | awk 'BEGIN{RS="\r\n\r\n"} NR>1')
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
