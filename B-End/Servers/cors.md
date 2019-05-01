## CORS

You will come across a 'cors' error message when you try to get data from your back-end API.

**In your back-end api for nc-news:**

1. `npm install cors`
2. In your App.js file, add `const cors = require('cors')`
3. In your App.js file, add `app.use(cors())` after all of your `require` statements.

More info found here: https://expressjs.com/en/resources/middleware/cors.html

## FAQ

**How can I decide where to put my 'state'/how data of articles etc?** -
So far, you've mainly been doing small projects where most of the data is in the `App`'s state. However, storing everything in App shouldn't become the default. Look at your component tree diagram at which components need access to the data you're considering - try and keep the state for this as _low_ in the tree as possible, without you having to duplicate data (i.e. the lowest possible parent component to each place that needs access to that data).

**What if I want to get data in a way that my back-end doesn't allow?** -
Don't be afraid of going back to update/change your back-end slightly to make it work for you! If you find yourself constantly over-fetching (getting much more info than you need) or having to consistently manipulate the data to get it to look the right way, then just go to your api and make it work for you :)

**Do I have to stick to the must-have user stories?** -
They are there as a guide of what works well for the user but by no means are set in stone - if you think of a different way to do something, then go for it. This is _your_ project and we love it when projects have some unique/interesting features.

**I'm still unsure about where/how to put routing into my NC-News** -
First point of call should be looking at the docs - they are really good for this and looking at their examples will help you. Secondly, have a look at the logic inside your Student Tracker sprint and think about how it can apply to your NC-News. Look at your 'wireframe' layout diagram as a guide for the top level router you might want.

**I'm really new to CSS/styling, how can I make my project look good without spending hours on it?** -
Focus on getting your functionality sorted out first - we cannot stress this enough (it's very easy to accidentally spend hours and hours on CSS). After you've got the functionality sorted, if you don't feel confident styling it all using your own CSS, feel free to use any styling frameworks that take your fancy ('Bootstrap' is common one). The focus of this project is on the front-end 'architecture' that you're building in React, not forcing you to create your own complicated styling. Note that it is hard to do a mix of frameworks (including mixing your own css styling with a framework).

**When back in Northcoders, when should I ask for help?** -
If you are stuck because of an error, analyse the message with it - React messages are often quite specific about why is it error-ing out so get used to their messages (see tips below). Sometimes the error in the console is different to the one in the main part of your web-page so it is useful to look at both to deduce the cause of the error. Also, spend some time googling your issue - someone out there has probably had this issue before. If you've done both of these and are still stuck, then please do ask for help - we really don't want you silently stuck on a problem for hours and hours :)

---

### Some common React errors...

**'cannot read property 'state' of undefined'** --> Think carefully about WHAT is undefined in this case. You might be getting this because your methods in a class component are not arrow functions.

**'Objects are not valid as a React child'** --> You are telling React to render a JavaScript object onto the webpage (which it cannot do), so try and find where that is and make sure to render only the values in that object that you want

**'Adjacent JSX elements must be wrapped in an enclosing tag'** --> How many JSX elements can be returned out of a component at one time? Have a look at how many you are returning.