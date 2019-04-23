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
  //Add feedback button
  <body>
    <button id="btn"></button>
  <body>
  //Add style of the button
  <style>
        #btn {
            position: fixed;
            right: 50px;
            bottom: 100px;
            width: 80px;
            height: 80px;
            padding: 10px;
            border: none;
            outline: none;
            border-radius: 50%;
            background: #3986FF;
            color: #FFF;
            cursor: pointer;
        }
  </style>
  // initialization after DOM loaded
  // global UserTrack: true 
  <script>
    window.onload = function () {
        window.UserTrack.init({
            trigger: document.querySelector('#btn'), // button to trigger feedback dialog
            title: 'Send feedback', // title for feedback dialog
            placeholder: 'Describe your issue or share your ideas', // placeholder for feedback text
            requiredTip: 'description is required', // tip for feedback text
            editTip: 'Click to highlight or hide info', // mouseover tip on edit screenshot
            loadingTip: 'loading screenshot...', // tip for loading screenshot
            checkboxLabel: 'Include screenshot', // label for include/exclude screenshot checkbox
            cancelLabel: 'cancel', // cancel button text
            confirmLabel: 'send', // submit button text
            hightlightTip: 'Highlight issues', // mouseover tip for highlight
            hideTip: 'Hide sensitive info', // mouseover tip for hide private content
            editDoneLabel: 'Done', // button text for submit highlight & blacks edit
            submitCallback: function (data) {
                // Add the submit feedback code here
                console.log(data)
            }
        })
    }
  </script>
  ```
