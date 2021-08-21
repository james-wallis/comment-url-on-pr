import * as core from '@actions/core'
import * as github from '@actions/github'
import { createComment } from './comments'
import { commentOnPullRequest, getWorkflowUrl } from './github'
import { EnvironmentStatus } from './types/EnvironmentStatus'
import { Octokit } from './types/Octokit'
import { getEnvironmentUrlsFromInput } from './utils'

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
    ref
  } = github.context

  const workflowUrl = await getWorkflowUrl(octokit, owner, repo, runId)

  const commentBody = createComment(title, status, workflowUrl, urls)

  await commentOnPullRequest(octokit, owner, repo, ref, commentBody)
}

// eslint-disable-next-line github/no-then
main().catch((err) => core.setFailed(err.message))
