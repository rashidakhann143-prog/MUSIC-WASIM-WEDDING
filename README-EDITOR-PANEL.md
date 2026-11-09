# Wasim & Ameen Wedding – Editing Panel Test Build

## Open the editing panel
After the project is deployed to a TEST site, open the test URL with `?edit=1` at the end, for example:

`https://YOUR-TEST-SITE.netlify.app/?edit=1`

This is a convenience switch only, not a secure login. Anyone who knows the URL can open it. Do not use it as private security.

## Card editor
- Replace image: upload a new JPG/PNG for any existing card.
- Remove: remove a card from the current card list.
- Add new card: upload another card image.
- Edit the title and subtitle.
- Save changes stores the edited card data in this browser's local storage.

## Music editor
- Turn the old synthesized background melody off by default.
- Upload up to five music files to preview them in the editing panel.
- Adjust preview volume and select OFF.
- Music files are currently previewed in the browser only; they are not yet published for guests.

## Important deployment limitation
Card edits saved in local storage are only available in the same browser/device. To make changes visible to every guest, the updated images and configuration must be published as website assets (or connected to shared cloud storage). This build is a front-end test implementation and does not provide shared server-side storage or authentication.

## Build
- Install dependencies with `npm install`
- Build with `npm run build`
- Netlify build command: `npm run build`
- Publish directory: `dist`
