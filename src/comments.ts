import { COMMENT_PREFIX } from './constants'
import { getWorkflowIcon, getWorkflowStatusText } from './utils'
import { EnvironmentStatus } from './types/EnvironmentStatus'
import { EnvironmentUrls } from './types/EnvironmentUrls'

const convertTitleToMarkdown = (title: string): string => `### ${title}`

const deletionText = 'The environment for this branch has been deleted.'

const deploymentStatusText = 'To see the status of your deployment, click below or on the icon next to each commit.'

const pullRequestText = (type: EnvironmentStatus): string => {
  let isBeing = 'is being'
  if (type === EnvironmentStatus.Success) {
    isBeing = 'has been'
  }

  return `This pull request ${isBeing} automatically deployed to an ephemeral environment on AWS.`
}

const workflowText = (type: EnvironmentStatus, url: string): string => {
  const icon = getWorkflowIcon(type)
  const status = getWorkflowStatusText(type)
  return `${icon} &nbsp;${status}GitHub Workflow: ${url}`
}

const urlsText = ({ classicCms, launcher, skylark }: EnvironmentUrls): string => {
  let text = ''

  if (skylark) {
    text += `☁️ &nbsp;Skylark URL: ${skylark}\n`
  }

  if (launcher) {
    text += `🚀 &nbsp;Launcher URL: ${launcher}\n`
  }

  if (classicCms) {
    text += `🏛️ &nbsp;Classic CMS URL: ${classicCms}\n`
  }

  return text
}

export const createComment = (
  title: string,
  type: EnvironmentStatus,
  workflowUrl: string,
  urls: EnvironmentUrls
): string => {
  let infoText = `${pullRequestText(type)}\n${deploymentStatusText}`
  if (type === EnvironmentStatus.Deleted) {
    infoText = deletionText
  }

  return `${COMMENT_PREFIX}
${convertTitleToMarkdown(title)}

${infoText}

${workflowText(type, workflowUrl)}
${urlsText(urls)}
`
}
