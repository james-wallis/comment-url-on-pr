<p align="center">
  <a href="https://github.com/ostmodern/comment-url-on-pr/actions/workflows/all_build-and-test.yml"><img alt="build-and-test action status" src="https://github.com/ostmodern/comment-url-on-pr/actions/workflows/all_build-and-test.yml/badge.svg"></a>
  <a href="https://github.com/ostmodern/comment-url-on-pr/actions/workflows/main_build-and-tag.yml"><img alt="build-and-tag action status" src="https://github.com/ostmodern/comment-url-on-pr/actions/workflows/main_build-and-tag.yml/badge.svg"></a>
</p>

# Comment environment URL on a pull request

Using GitHub Actions to create a development version of Skylark, the CMS or more? This is the GitHub Action for you.

This Action adds a comment to a pull request containing Ostmodern related environment URLs and the status of the workflow that is creating the related environments.

Its aim is to improve the feedback loop by allowing URLs to be found on the PR as opposed to looking through GitHub workflows.

![screenshot of a comment](https://user-images.githubusercontent.com/17385115/130422773-16195b94-1360-4edc-99a9-91399c1e4f9b.png)


## Contributing

### Requirements
* Node 14+

### Developing

The easiest way to develop features is to commit to a new branch and create a pull request - this way you'll see the comment added to your own pull request.

A good workflow is:
1. Install dependencies: `npm ci`
2. Make changes
3. Build the Action:  `npm run build:all`
4. Commit and push to your branch
5. Let the Action run itself and then see the comment created on the pull request - you might need to refresh the page.

### Tooling
* Eslint and Prettier for code styling
* Jest used for tests
* Husky runs a pre-commit hook to lint and run tests


## Releasing

On a push to the `main` branch (either by a commit or a merged pull request) a GitHub Action is run that will:
1. Build and package to ensure the `dist` directory is up to date
2. Commit the `dist` directory, if updated
3. Automatically create a new tag using the [github-tag-action](https://github.com/anothrNick/github-tag-action/releases)

All that is left to do is navigate to the `releases` tab and create a new release.
