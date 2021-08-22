import * as core from '@actions/core'
import * as github from '@actions/github'
import { createComment } from './lib/comments'
import { commentOnPullRequest, getPullRequestNumber, getWorkflowUrl } from './lib/github'
import { EnvironmentStatus } from './types/environmentStatus'
import { Octokit } from './types/octokit'
import { getEnvironmentUrlsFromInput } from './lib/utils'

async function main(): Promise<void> {
  const required: core.InputOptions = { required: true }

  const title = core.getInput('title', required)
  const status = core.getInput('status', required) as EnvironmentStatus
  const github_token = core.getInput('github_token', required)
  const urls = getEnvironmentUrlsFromInput()

  if (!Object.values(EnvironmentStatus).includes(status)) {
    throw new Error(`Invalid status '${status}' given`)
  }

  const octokit: Octokit = github.getOctokit(github_token)

  const {
    repo: { owner, repo },
    runId,
    ref,
    payload
  } = github.context

  const pullRequestNumber = await getPullRequestNumber(octokit, owner, repo, ref, payload)
  if (!pullRequestNumber) {
    core.warning(`No pull request found for ref ${ref}`)
    return
  }

  const workflowUrl = await getWorkflowUrl(octokit, owner, repo, runId)

  const commentBody = createComment(title, status, workflowUrl, urls)

  await commentOnPullRequest(octokit, owner, repo, pullRequestNumber, commentBody)
}

// eslint-disable-next-line github/no-then
main().catch((err) => {
  if (err.message === 'Resource not accessible by integration') {
    core.warning(
      "Can't comment on PR - unable to use the supplied 'github_token'. Potential reasons include: the PR is raised by Dependabot or the workflow has restricted the token access"
    )
    core.error(err)
  } else {
    core.error(err)
    core.setFailed(err.message)
  }
})
