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
  Or
  ```js
  //Directly refer to the js file
  <link rel="stylesheet" href="https://usertracklib.azurewebsites.net/${version}/usertrack.${version}.css">
  <script src="https://usertracklib.azurewebsites.net/${version}/usertrack.${version}.min.js"></script>
  ```

## versions

version | release time | change log
---- | --- | ---
v0.0.1 | 22/04/2019 | [Change Log v0.0.1](https://github.com/linwei0201/UserTrack/blob/master/ChangeLog.md)


  If jQuery is already referenced in your project, please put the usertrack.[hash].min.js in front of jQuery.
  ```js
  //Add feedback div and button
  <body>
    <div id="feedback"></div>
    <button id="btn"></button>
  <body>
  //Add style of the button
  <style>
        #btn {
            padding: 10px;
            width: 80px;
            height: 80px;
            position: fixed;
            right: 50px;
            bottom: 100px;
            background: #3986FF;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #FFF;
            border: none;
            outline: none;
            cursor: pointer;
            height: calcu();
        }
  </style>
  // initialization after DOM loaded
  // global UserTrack: true 
  <script>
    window.onload = function () {
        window.UserTrack.init({
            container: document.getElementById('feedback'),
            trigger: document.getElementById('btn'),
            theme: '',
            title: 'Send feedback',
            placeholder: 'Describe your issue or share your ideas',
            requiredTip: 'description is required',
            editTip: 'Click to highlight or hide info',
            loadingTip: 'loading screenshot...',
            checkboxLabel: 'Include screenshot',
            cancelLabel: 'cancel',
            confirmLabel: 'send',
            hightlightTip: 'Highlight issues',
            hideTip: 'Hide sensitive info',
            editDoneLabel: 'Done',
            submitCallback: function (data) {
                //Add the submit feedback code here
                console.log(data)
            }
        })
    }
  </script>
  ```
