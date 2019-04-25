# UserTrack
a library to track user behaviors

## How to use

- development mode

  - start server `npm start`
  - import js `<script src="http://localhost:9000/usertrack.js" ></script>`
  - init after DOM loaded `UserTrack.init()`

- production mode

  - step1: import jQuery in html

    ```html
    <script
      src="https://usertracklib.azurewebsites.net/libs/jquery3.4.0.min.js" integrity="sha384-kHYroeqmDLEHg6UAlmLCR5G9c2vjZu2xayu/NUreWj3VlnrOyV/+hgBSlITtJHvf" crossorigin="anonymous">
    </script>
    ```
  - step2: install and import library

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
  - step3: add trigger button in html
  
    ```html
    <body>
      <button id="btn"></button>
    <body>
    //Add style of the button
    <style>
      #btn {
        width: 80px;
        height: 32px;
        line-height: 32px; 
        text-align: center;
        position: fixed;
        right: 50px;
        bottom: 100px;
        background: #0063B1;
        color: #FFF;
        border: none;
        outline: none;
        cursor: pointer;
      }
    </style>
    ```

  - step4: add initial config after window.onload
  
    ```js
    window.onload = function () {
      window.UserTrack.init({
        trigger: document.querySelector('#btn'), // button to trigger feedback dialog
        title: 'Send Feedback', // title for feedback dialog
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
    ```

## versions

version | release time | change log
---- | --- | ---
v0.0.1 | 22/04/2019 | [Change Log v0.0.1](https://github.com/linwei0201/UserTrack/blob/master/ChangeLog.md)
