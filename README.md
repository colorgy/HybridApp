Colorgy Hybrid App
==================

Colorgy hybrid web app with [React](http://facebook.github.io/react/), [Redux](https://github.com/rackt/redux) [Webpack](https://webpack.github.io/) and [Cordova](https://cordova.apache.org/).

## Develop

```bash
npm install
npm start
```

Then `open http://localhost:3010/` and go!

## Build

```bash
npm install -g cordova
npm install
npm run build
```

For iOS, `open cordova/platforms/ios/Colorgy.xcodeproj`. Or with Android, open [Android Studio](http://developer.android.com/tools/studio/index.html) and <kbd>Import Project</kbd>: `cordova/platforms/android/build.gradle`.
