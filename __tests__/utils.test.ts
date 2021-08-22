import { expect, it, describe } from '@jest/globals'
import { getWorkflowIcon, getWorkflowStatusText } from '../src/lib/utils'
import { EnvironmentStatus } from '../src/types/environmentStatus'
import { ICONS } from '../src/lib/constants'

describe('Utils', () => {
  describe('getWorkflowIcon', () => {
    it('returns the success icon given the success type', () => {
      const icon = getWorkflowIcon(EnvironmentStatus.Success)
      expect(icon).toEqual(ICONS.SUCCESS)
    })

    it('returns the building icon given the building type', () => {
      const icon = getWorkflowIcon(EnvironmentStatus.Building)
      expect(icon).toEqual(ICONS.BUILDING)
    })

    it('returns the deleted icon given the deleted type', () => {
      const icon = getWorkflowIcon(EnvironmentStatus.Deleted)
      expect(icon).toEqual(ICONS.DELETED)
    })

    it('returns the cancelled icon given the cancelled type', () => {
      const icon = getWorkflowIcon(EnvironmentStatus.Cancelled)
      expect(icon).toEqual(ICONS.CANCELLED)
    })

    it('returns the failure icon given the failure type', () => {
      const icon = getWorkflowIcon(EnvironmentStatus.Failure)
      expect(icon).toEqual(ICONS.FAILURE)
    })

    it('returns the unknown icon given an unknown type', () => {
      const icon = getWorkflowIcon('unknown type' as EnvironmentStatus)
      expect(icon).toEqual(ICONS.UNKNOWN)
    })
  })

  describe('getWorkflowStatusText', () => {
    it('returns nothing when given the success type', () => {
      const text = getWorkflowStatusText(EnvironmentStatus.Success)
      expect(text).toEqual('')
    })

    it('returns [Failed] when given the failure type', () => {
      const text = getWorkflowStatusText(EnvironmentStatus.Failure)
      expect(text).toEqual('[Failed] ')
    })

    it('returns [Cancelled] when given the cancelled type', () => {
      const text = getWorkflowStatusText(EnvironmentStatus.Cancelled)
      expect(text).toEqual('[Cancelled] ')
    })

    it('returns [Deleted] when given the deleted type', () => {
      const text = getWorkflowStatusText(EnvironmentStatus.Deleted)
      expect(text).toEqual('[Deleted] ')
    })

    it('returns [Building] when given the building type', () => {
      const text = getWorkflowStatusText(EnvironmentStatus.Building)
      expect(text).toEqual('[Building] ')
    })

    it('returns [Unknown] when given the unknown type', () => {
      const text = getWorkflowStatusText('unknown type' as EnvironmentStatus)
      expect(text).toEqual('[Unknown] ')
    })
  })
})
