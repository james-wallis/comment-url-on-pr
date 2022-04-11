import { expect, it, describe } from '@jest/globals'
import { createComment } from '../src/lib/comments'
import { DEFAULT_COMMENT_PREFIX } from '../src/lib/constants'
import { EnvironmentStatus } from '../src/types/environmentStatus'
import { EnvironmentUrls } from '../src/types/environmentUrls'

const defaultEnvironmentUrls: EnvironmentUrls = {
  skylark: '',
  classicCms: '',
  launcher: '',
  objectRegistry: '',
  otherUrls: []
}

describe('Comments', () => {
  describe('createComment', () => {
    it('should create a comment', () => {
      const comment = createComment('title', EnvironmentStatus.Success, 'workflowUrl', defaultEnvironmentUrls, '')
      expect(comment).toContain(DEFAULT_COMMENT_PREFIX)
      expect(comment).toContain('title')
      expect(comment).toContain('workflowUrl')
    })

    it('should convert the title to a Markdown heading', () => {
      const comment = createComment('title', EnvironmentStatus.Success, '', defaultEnvironmentUrls, '')
      expect(comment).toContain('### title')
    })

    it("should contain 'has been' when the status is success", () => {
      const comment = createComment('title', EnvironmentStatus.Success, '', defaultEnvironmentUrls, '')
      expect(comment).toContain('has been')
    })

    it("should contain 'is being' when the status is building", () => {
      const comment = createComment('title', EnvironmentStatus.Building, '', defaultEnvironmentUrls, '')
      expect(comment).toContain('is being')
    })

    it("should contain 'deleted' when the status is deleted", () => {
      const comment = createComment('title', EnvironmentStatus.Deleted, '', defaultEnvironmentUrls, '')
      expect(comment).toContain('deleted')
    })

    it('should contain no environment URLs when all are empty strings', () => {
      const comment = createComment('title', EnvironmentStatus.Success, '', defaultEnvironmentUrls, '')
      expect(comment).not.toContain('Skylark')
      expect(comment).not.toContain('Launcher')
      expect(comment).not.toContain('Classic CMS')
      expect(comment).not.toContain('Object Registry Server')
    })

    it('should contain all environment URLs when all are given', () => {
      const environmentUrls: EnvironmentUrls = {
        skylark: 'https://skylark.com',
        classicCms: 'https://classic-cms.com',
        launcher: 'https://launcher.com',
        objectRegistry: 'https://objectregistry.com',
        otherUrls: []
      }
      const comment = createComment('title', EnvironmentStatus.Success, '', environmentUrls, '')
      expect(comment).toContain(`Skylark: [${environmentUrls.skylark}](${environmentUrls.skylark})`)
      expect(comment).toContain(`Launcher: [${environmentUrls.launcher}](${environmentUrls.launcher})`)
      expect(comment).toContain(`Classic CMS: [${environmentUrls.classicCms}](${environmentUrls.classicCms})`)
      expect(comment).toContain(
        `Object Registry Server: [${environmentUrls.objectRegistry}](${environmentUrls.objectRegistry})`
      )
    })

    it('should list out all otherUrls when given', () => {
      const otherUrls: EnvironmentUrls['otherUrls'] = [
        {
          label: 'firsturl',
          value: 'https://value.com'
        },
        {
          label: 'secondurl',
          value: 'https://second.com',
          emoji: '💥'
        }
      ]
      const comment = createComment(
        'title',
        EnvironmentStatus.Success,
        '',
        { ...defaultEnvironmentUrls, otherUrls },
        ''
      )
      expect(comment).toContain(`${otherUrls[0].label}: [${otherUrls[0].value}](${otherUrls[0].value})`)
      expect(comment).toContain(
        `${otherUrls[1].emoji} &nbsp;${otherUrls[1].label}: [${otherUrls[1].value}](${otherUrls[1].value})`
      )
    })

    it('should remove URL query parameters from being shown when given', () => {
      const environmentUrls: EnvironmentUrls = {
        skylark: 'https://skylark.com',
        classicCms: 'https://classic-cms.com',
        launcher: 'https://launcher.com/login?username=admin@example.com',
        objectRegistry: '',
        otherUrls: []
      }
      const comment = createComment('title', EnvironmentStatus.Success, '', environmentUrls, '')
      expect(comment).toContain(`Launcher: [https://launcher.com/login](${environmentUrls.launcher})`)
    })

    it('should use the default comment id when an empty string is given', () => {
      const comment = createComment('title', EnvironmentStatus.Success, '', defaultEnvironmentUrls, '')
      expect(comment).toContain(`<!-- ${DEFAULT_COMMENT_PREFIX} -->`)
    })

    it('should use the default comment id when undefined is given', () => {
      const comment = createComment('title', EnvironmentStatus.Success, '', defaultEnvironmentUrls, undefined)
      expect(comment).toContain(`<!-- ${DEFAULT_COMMENT_PREFIX} -->`)
    })

    it('should use the custom comment id when one is given', () => {
      const customId = 'custom-comment-id'
      const comment = createComment('title', EnvironmentStatus.Success, '', defaultEnvironmentUrls, customId)
      expect(comment).toContain(`<!-- ${customId} -->`)
    })
  })
})
