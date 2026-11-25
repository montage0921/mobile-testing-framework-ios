# apps/

Put the application files you test here: `.apk` for Android, `.app` (simulator build) for iOS.
They are git-ignored.

Training app: the open-source Wikipedia Android app, alpha build
(package `org.wikipedia.alpha`). Save it as `apps/WikipediaSample.apk`.
Ask the training owner for the file if you do not have it.

Use the same `.apk` for both targets:
- Local emulator: `ANDROID_APP_PATH` in `.env` points at it.
- Perfecto: `npm run upload -- apps/WikipediaSample.apk` copies it to the Perfecto repository.

Your own application: use a debug or test build that you are allowed to install
on shared cloud devices.

iOS: build the open-source Wikipedia iOS app for a simulator in Xcode and copy the `Wikipedia.app`
folder here. `IOS_APP_PATH` in `.env` points at it.
