# apps/

Put the Android application files (`.apk`) you test here. They are git-ignored.

Training app: the open-source Wikipedia Android app, alpha build
(package `org.wikipedia.alpha`). Save it as `apps/WikipediaSample.apk`.
Ask the training owner for the file if you do not have it.

Use the same `.apk` for both targets:
- Local emulator: `ANDROID_APP_PATH` in `.env` points at it.
- Perfecto: `npm run upload -- apps/WikipediaSample.apk` copies it to the Perfecto repository.

Your own application: use a debug or test build that you are allowed to install
on shared cloud devices.
