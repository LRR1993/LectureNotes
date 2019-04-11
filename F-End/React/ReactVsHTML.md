## React v HTML
Some of these differences:
<table><tr><td>
    HTML
</td><td>
    React
</td></tr><tr><td>
    To interface with the DOM in HTML5, you have to used document and element methods.
</td><td>
    React allows you to use Javascript to interact with the DOM.
</td></tr><tr><td>
    To create HTML5, you use HTML5!
</td><td>
    React uses a proprietary 'language' called JSX - it emulates HTML markup, but is processed into React Components - good old OOP Javascript.
</td></tr><tr><td>
    HTML is sourced/created on the server, to be sent to client, and new html is requested.
</td><td>
    React uses JS to build and rebuild the html on the client side - everything can be done on one page.
</td></tr><tr><td>
    HTML is responsible for the 'Views' in an MVC pattern application.
</td><td>
    As React create single-page apps, it is also arguably responsible for the 'Controller' element of an MVC pattern.
</td></tr><tr><td>
    HTML is parsed linearly.
</td><td>
    React allows you to separate 'concerns' into components, which allows them to be modified and reused (with JS).
</td></tr><tr><td>
    HTML DOM methods are largely imperative.
</td><td>
    React is largely declarative.
</td></tr><tr><td>
    Making changes with DOM manipulation is quite slow - that's the way HTML is (recursive methods).
</td><td>
    JS however is quick, so using this to identify changes is more efficient. React employs a virtual DOM, which checks itself against the previous version of the DOM, and only updates what has actually changed.
</td></tr></table>
The main difference could be how easy React makes it to "hydrate" a page with data from API requests on the client side.
We want to get things going, so some things are going to stay 'magic' for a while - but everything will get demystified eventually. Here's the basic way things are linked up:
- Everything is transpiled down to html & JS.
- Public folder contains index.html - this is what is served to the browser.
- The ReactDOM.render is called, linking everything to the 'root' in the index.html.
