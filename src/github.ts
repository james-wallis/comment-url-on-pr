import { COMMENT_PREFIX } from './constants'
import { Octokit } from './types/Octokit'

// returns the pull request number (if one exists) given a branch ref
const getPullRequestNumber = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  ref: string
): Promise<number | undefined> => {
  // If pull request, return the pull number
  if (ref.startsWith('refs/pull/')) {
    return parseInt(ref.split('/')[2])
  }

  if (!ref.startsWith('refs/heads/')) {
    return
  }

  const pulls = await octokit.rest.pulls.list({
    owner,
    repo
  })

  const branchName = ref.replace('refs/heads/', '')
  const pullRequest = pulls.data.find(({ head: { ref } }) => ref === branchName)
  if (!pullRequest) {
    return
  }
  return pullRequest.number
}

// returns the comment id of a previously created comment if one exists
const getExistingCommentId = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  issueNumber: number
): Promise<number | undefined> => {
  const comments = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: issueNumber
  })

  const comment = comments.data.find((comment) => comment.body?.includes(COMMENT_PREFIX))

  return comment?.id
}

// comments on a GitHub issue, updates an existing comment if one exists
// in GitHub terms, pull requests are issues
const commentOnIssue = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  issueNumber: number,
  body: string
): Promise<void> => {
  const commentId = await getExistingCommentId(octokit, owner, repo, issueNumber)

  const commentReqBody = {
    owner,
    repo,
    issue_number: issueNumber,
    body
  }
  if (commentId) {
    await octokit.rest.issues.updateComment({
      ...commentReqBody,
      comment_id: commentId
    })
    return
  }
  await octokit.rest.issues.createComment(commentReqBody)
}

// comments on a pull request given a branch ref
export const commentOnPullRequest = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  ref: string,
  commentBody: string
): Promise<void> => {
  const pullNumber = await getPullRequestNumber(octokit, owner, repo, ref)
  if (!pullNumber) {
    throw new Error(`No pull requests found for ref ${ref}`)
  }

  await commentOnIssue(octokit, owner, repo, pullNumber, commentBody)
}

// returns the workflow url given a workflow run id
export const getWorkflowUrl = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  workflowRunId: number
): Promise<string> => {
  const workflow = await octokit.rest.actions.getWorkflowRun({
    owner,
    repo,
    run_id: workflowRunId
  })
  if (!workflow || !workflow.data) {
    throw new Error(`Can't find matching workflow run with ID ${workflowRunId}`)
  }
  return workflow.data.html_url
}
