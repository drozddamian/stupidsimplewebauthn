// Function to convert Uint8Array to base64url string
import { AuthenticatorTransportFuture } from '@simplewebauthn/types'

export function toBase64Url(uint8Array: Uint8Array): string {
  return Buffer.from(uint8Array)
    .toString('base64')
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, '') // Remove trailing '='
}

export function toBytea(array: Uint8Array): Buffer {
  return Buffer.from(array)
}

export function arrayToCSV(array: string[]): string {
  return array.join(',')
}

export function fromBase64UrlString(base64url: string): Uint8Array {
  // Convert base64url to base64 by replacing URL-safe characters with the standard base64 equivalents
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')

  // Pad the base64 string with '=' to make it valid base64 encoding
  const paddedBase64 = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    '=',
  )

  // Decode base64 to a Buffer, and then create a Uint8Array from the Buffer
  const buffer = Buffer.from(paddedBase64, 'base64')
  return new Uint8Array(buffer)
}

export function authenticatorTransportCSVToTypedArray(
  transportString?: string,
): AuthenticatorTransportFuture[] {
  return transportString?.split(',') as AuthenticatorTransportFuture[]
}
