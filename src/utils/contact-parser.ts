import type { ContactProfile } from '../types/contact'
import { validateContact, type ContactIssue } from './contact-validator'

export class ContactParseError extends Error {
  readonly issues: ContactIssue[]

  constructor(message: string, issues: ContactIssue[] = []) {
    super(message)
    this.name = 'ContactParseError'
    this.issues = issues
  }
}

/** Parses one contact JSON document. */
export async function parseContactDocument(
  raw: string,
  expectedCode: string,
): Promise<ContactProfile> {
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch (error) {
    throw new ContactParseError(
      `Invalid JSON: ${error instanceof Error ? error.message : 'the contact could not be read.'}`,
    )
  }

  const result = validateContact(data, expectedCode)
  if (!result.valid || !result.profile) {
    const firstError = result.issues.find((issue) => issue.severity === 'error')
    throw new ContactParseError(
      firstError ? `${firstError.path}: ${firstError.message}` : 'The contact is invalid.',
      result.issues,
    )
  }

  return result.profile
}
