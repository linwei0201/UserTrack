# UserTrack
a library to track user behaviors

## How to use

- development mode

  - start server `npm start`
  - import js `<script src="http://localhost:9000/usertrack.js" ></script>`
  - init after DOM loaded `UserTrack.init()`

- production mode

  ```bash
  # install package from npm
  npm i usertrack --save
  ```

  ```js
  // import js and css
  import UserTrack from 'usertrack'
  import 'usertrack/usertrack.[hash].css'
  ```

  ```js
  // initialization after DOM loaded
  /* global UserTrack: true */
  UserTrack.init();
  ```
