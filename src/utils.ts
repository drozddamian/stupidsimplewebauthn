// Function to convert Uint8Array to base64url string
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
