# Wasim & Ameen Wedding Invitation — Combined Test Project

This is the single combined project source (not two separate versions). It retains the original invitation assets and the existing guest-name/link-generator interface. Guest links support `?to=Guest%20Name&event=baraat` or `event=raatijaga`.

## Run locally
1. Install Node.js 20.19+ (or 22.12+).
2. In this folder run `npm install`.
3. Run `npm run dev` and open the local URL shown by Vite.
4. Run `npm run build` before deploying.

## Important limitations
- This project does **not** have secure, server-side admin authentication. The generator is not private; do not put confidential information in it.
- Three selectable music tracks and an OFF selector have not been implemented; the supplied archive does not include three licensed audio tracks.
- The project is a test package, not a verified production deployment. Test the build and guest-facing experience before publishing.
