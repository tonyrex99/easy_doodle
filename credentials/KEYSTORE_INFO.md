# Easy Doodle Production Release Keystore

This directory contains the production release signing keystore used to sign both the `.aab` (Android App Bundle) and `.apk` for Google Play Store release.

## Keystore Details
- **Keystore File**: `easy-doodle-release.keystore`
- **Keystore Type**: `PKCS12`
- **Key Alias**: `easy-doodle-key-alias`
- **Store Password**: `easydoodle2026!`
- **Key Password**: `easydoodle2026!`
- **Validity**: 10,000 days (Until April 3, 2054)
- **Subject / Owner**: `CN=Easy Doodle, OU=Mobile Development, O=Easy Doodle, L=Lagos, ST=Lagos, C=NG`

## Certificate Fingerprints
- **SHA-1**: `21:0F:A4:9D:77:EB:1F:4B:B5:20:FD:56:CA:B6:67:4B:8E:7E:5A:FC`
- **SHA-256**: `82:77:D1:05:38:94:8A:28:53:0F:A5:1D:96:B2:8F:97:32:87:1B:5A:D9:54:E5:BA:76:8C:C7:74:35:7D:B6:AC`

> **IMPORTANT**: Keep this keystore safe! Google Play requires this key (or Google Play App Signing with this upload key) to accept app updates.

