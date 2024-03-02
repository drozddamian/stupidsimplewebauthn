export type User = {
  id: string
  username: string
  password: string
  challenge: string
}

export type AttestationConveyancePreference =
  | 'direct'
  | 'enterprise'
  | 'indirect'
  | 'none'

export type AuthenticatorTransport =
  | 'ble'
  | 'hybrid'
  | 'internal'
  | 'nfc'
  | 'usb'

export type UserVerificationRequirement =
  | 'discouraged'
  | 'preferred'
  | 'required'

export type AuthenticatorAttachment = 'cross-platform' | 'platform'

export type ResidentKeyRequirement = 'discouraged' | 'preferred' | 'required'
