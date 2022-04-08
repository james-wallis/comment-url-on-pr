import { getInput } from '@actions/core'
import { ICONS } from './constants'
import { EnvironmentStatus } from '../types/environmentStatus'
import { EnvironmentUrls } from '../types/environmentUrls'

export const getWorkflowIcon = (type: EnvironmentStatus): string => {
  switch (type) {
    case EnvironmentStatus.Success:
      return ICONS.SUCCESS
    case EnvironmentStatus.Building:
      return ICONS.BUILDING
    case EnvironmentStatus.Cancelled:
      return ICONS.CANCELLED
    case EnvironmentStatus.Failure:
      return ICONS.FAILURE
    case EnvironmentStatus.Deleted:
      return ICONS.DELETED
    default:
      return ICONS.UNKNOWN
  }
}

export const getWorkflowStatusText = (type: EnvironmentStatus): string => {
  let text
  switch (type) {
    case EnvironmentStatus.Success:
      text = ''
      break
    case EnvironmentStatus.Building:
      text = 'Building'
      break
    case EnvironmentStatus.Cancelled:
      text = 'Cancelled'
      break
    case EnvironmentStatus.Failure:
      text = 'Failed'
      break
    case EnvironmentStatus.Deleted:
      text = 'Deleted'
      break
    default:
      text = 'Unknown'
      break
  }
  return text ? `[${text}] ` : ''
}

export const getEnvironmentUrlsFromInput = (): EnvironmentUrls => {
  const urls: EnvironmentUrls = {
    classicCms: getInput('classic_cms_url'),
    launcher: getInput('launcher_url'),
    skylark: getInput('skylark_url'),
    objectRegistry: getInput('object_registry_url'),
    otherUrls: []
  }

  const otherUrlsInput = getInput('additional_urls')
  if (otherUrlsInput) {
    urls.otherUrls = JSON.parse(otherUrlsInput)
  }

  return urls
}
