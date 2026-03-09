
/**
 * Stride: Passkey (WebAuthn) Utilities
 * This module provides functions to interact with the browser's WebAuthn API.
 */

/**
 * Converts an ArrayBuffer to a Base64URL string.
 */
function bufferToBase64URL(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Converts a Base64URL string to an ArrayBuffer.
 */
function base64URLToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (base64.length % 4)) % 4;
  const binary = atob(base64 + "=".repeat(padLen));
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return buffer;
}

/**
 * Checks if Passkeys are supported in the current environment.
 */
export function isPasskeySupported(): boolean {
  return (
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function"
  );
}

/**
 * Triggers the browser's Passkey registration flow.
 */
export async function registerPasskey(userId: string, userName: string, userDisplayName: string): Promise<any> {
    if (!isPasskeySupported()) {
        throw new Error("Passkeys are not supported on this device/browser.");
    }

    const challenge = crypto.getRandomValues(new Uint8Array(32));
    
    // In a real production app, the challenge, rp.id, and user.id would be fetched from a server.
    const createOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
            name: "Stride",
            id: window.location.hostname,
        },
        user: {
            id: new TextEncoder().encode(userId),
            name: userName,
            displayName: userDisplayName,
        },
        pubKeyCredParams: [
            { alg: -7, type: "public-key" }, // ES256
            { alg: -257, type: "public-key" }, // RS256
        ],
        timeout: 60000,
        attestation: "none",
        authenticatorSelection: {
            residentKey: "preferred",
            userVerification: "preferred",
            authenticatorAttachment: "platform",
        },
    };

    const credential = (await navigator.credentials.create({
        publicKey: createOptions,
    })) as PublicKeyCredential;

    if (!credential) {
        throw new Error("Failed to create passkey credential.");
    }

    const response = credential.response as AuthenticatorAttestationResponse;

    return {
        id: credential.id,
        rawId: bufferToBase64URL(credential.rawId),
        type: credential.type,
        response: {
            attestationObject: bufferToBase64URL(response.attestationObject),
            clientDataJSON: bufferToBase64URL(response.clientDataJSON),
        },
    };
}

/**
 * Triggers the browser's Passkey authentication flow.
 */
export async function authenticateWithPasskey(allowCredentials?: PublicKeyCredentialDescriptor[]): Promise<any> {
    if (!isPasskeySupported()) {
        throw new Error("Passkeys are not supported on this device/browser.");
    }

    const challenge = crypto.getRandomValues(new Uint8Array(32));

    const getOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        rpId: window.location.hostname,
        timeout: 60000,
        userVerification: "required",
        allowCredentials: allowCredentials,
    };

    const credential = (await navigator.credentials.get({
        publicKey: getOptions,
    })) as PublicKeyCredential;

    if (!credential) {
        throw new Error("Passkey authentication failed.");
    }

    const response = credential.response as AuthenticatorAssertionResponse;

    return {
        id: credential.id,
        rawId: bufferToBase64URL(credential.rawId),
        type: credential.type,
        response: {
            authenticatorData: bufferToBase64URL(response.authenticatorData),
            clientDataJSON: bufferToBase64URL(response.clientDataJSON),
            signature: bufferToBase64URL(response.signature),
            userHandle: response.userHandle ? bufferToBase64URL(response.userHandle) : null,
        },
    };
}
