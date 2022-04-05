import { getWorkflowIcon, getWorkflowStatusText } from './utils'
import { DEFAULT_COMMENT_PREFIX } from './constants'
import { EnvironmentStatus } from '../types/environmentStatus'
import { EnvironmentUrls } from '../types/environmentUrls'

export const createCommentPrefix = (commentId: string): string => `<!-- ${commentId} -->`

const convertTitleToMarkdown = (title: string): string => `### ${title}`

const deletionText = 'The environment for this branch has been deleted.'

const deploymentStatusText = 'To see the status of your deployment, click below or on the icon next to each commit.'

const pullRequestText = (type: EnvironmentStatus): string => {
  if (type === EnvironmentStatus.Deleted) {
    return deletionText
  }

  let isBeing = 'is being'
  if (type === EnvironmentStatus.Success) {
    isBeing = 'has been'
  }

  return `This pull request ${isBeing} automatically deployed.`
}

const workflowText = (type: EnvironmentStatus, url: string): string => {
  const icon = getWorkflowIcon(type)
  const status = getWorkflowStatusText(type)
  return `${icon} &nbsp;${status}GitHub Workflow: ${url}`
}

const urlTextLine = (icon: string, name: string, fullUrl: string): string => {
  const [displayUrl] = fullUrl.split('?')
  return `${icon} &nbsp;${name}: [${displayUrl}](${fullUrl})\n`
}

const urlsText = ({ classicCms, launcher, skylark, objectRegistry }: EnvironmentUrls): string => {
  let text = ''

  if (skylark) {
    text += urlTextLine('☁️', 'Skylark', skylark)
  }

  if (launcher) {
    text += urlTextLine('🚀', 'Launcher', launcher)
  }

  if (classicCms) {
    text += urlTextLine('🏛️', 'Classic CMS', classicCms)
  }

  if (objectRegistry) {
    text += urlTextLine('📒', 'Object Registry Server', objectRegistry)
  }

  return text
}

export const createComment = (
  title: string,
  type: EnvironmentStatus,
  workflowUrl: string,
  urls: EnvironmentUrls,
  commentId: string | undefined
): string => {
  const infoText = `${pullRequestText(type)}\n${deploymentStatusText}`

  return `${createCommentPrefix(commentId || DEFAULT_COMMENT_PREFIX)}
${convertTitleToMarkdown(title)}

${infoText}

${workflowText(type, workflowUrl)}
${urlsText(urls)}
`
}
