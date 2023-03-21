<p align="center">
  <a href="https://github.com/ostmodern/comment-url-on-pr/actions/workflows/all_build-and-test.yml"><img alt="build-and-test action status" src="https://github.com/ostmodern/comment-url-on-pr/actions/workflows/all_build-and-test.yml/badge.svg"></a>
  <a href="https://github.com/ostmodern/comment-url-on-pr/actions/workflows/main_build-and-tag.yml"><img alt="build-and-tag action status" src="https://github.com/ostmodern/comment-url-on-pr/actions/workflows/main_build-and-tag.yml/badge.svg"></a>
</p>

# Comment environment URL on a pull request

Using GitHub Actions to create a development version of Skylark, the CMS or more? This is the GitHub Action for you.

This Action adds a comment to a pull request containing Skylark-related environment URLs and the status of the workflow that is creating the related environments.

Its aim is to improve the feedback loop by allowing URLs to be found on the PR as opposed to looking through GitHub workflows.

![screenshot of a comment](https://user-images.githubusercontent.com/17385115/130422773-16195b94-1360-4edc-99a9-91399c1e4f9b.png)

## Examples

### With a static status

```yaml
- uses: ostmodern/comment-url-on-pr@v1.0.0
  with:
    title: 'A title for the comment'
    status: building
    github_token: ${{ github.token }}
    classic_cms_url: https://classic-cms-url.com
    skylark_url: https://skylark-url.com
    launcher_url: https://launcher-url.com
    object_registry_url: https://object-registry-url.com
    comment_id: 'my custom id'
```

### Using the job status

```yaml
- uses: skylark-platform/comment-url-on-pr@v1.0.0
  if: ${{ always() }} # Ensure it runs regardless of success, failure or cancel
  with:
    title: ${{ env.COMMENT_TITLE }} # Use env to prevent duplication in the same workflow
    status: ${{ job.status }} # The job.status (success, failure, cancelled) are valid
    github_token: ${{ github.token }}
    skylark_url: ${{ steps.deploy.outputs.url }}
```

#### Passing in custom URLs
```yaml
# Create an array of URLs and convert to JSON
- uses: actions/github-script@v6
  id: json
  with:
    result-encoding: string
    script: |
      const json = JSON.stringify([
        { label: "A Custom URL", value: "https://custom-url.com" },
        { emoji: "💥", label: "With Emoji", value: "https://custom-emoji-url.com" }
      ]);
      return json;
- uses: skylark-platform/comment-url-on-pr@v1.0.0
  with:
    title: 'A title for the comment'
    status: building
    github_token: ${{ github.token }}
    comment_id: 'my custom id'
    additional_urls: ${{ steps.json.outputs.result }} # Pass in result of previous step
```

## Contributing

### Requirements

- Node 14+

### Developing

The easiest way to develop features is to commit to a new branch and create a pull request - this way you'll see the comment added to your own pull request.

A good workflow is:

1. Install dependencies: `npm ci`
2. Make changes
3. Build the Action: `npm run build:all`
4. Commit and push to your branch
5. Let the Action run itself and then see the comment created on the pull request - you might need to refresh the page.

### Tooling

- Eslint and Prettier for code styling
- Jest used for tests
- Husky runs a pre-commit hook to lint and run tests

## Releasing

On a push to the `main` branch (either by a commit or a merged pull request) a GitHub Action is run that will:

1. Build and package to ensure the `dist` directory is up to date
2. Commit the `dist` directory, if updated
3. Automatically create a new tag using the [github-tag-action](https://github.com/anothrNick/github-tag-action/releases)

All that is left to do is navigate to the `releases` tab and create a new release.
