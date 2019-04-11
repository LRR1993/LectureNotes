# React

ES6 modules used in thefront end as it supported.

webpack bundles the different scripts thats been written inside the source folders

webpack can be customised... hidden to begin with

babel JS - js complier which turns jsx(htmllike) into react standard formal

## Components

functions example

```js
const Sum = props => {
  return;
  <section>
    <h1> Hello</h1>
    <p> 2+2 = {props.num1 + props.num2} </p>
  </section>;
};

React.DOM(<SUM num1={2} num2={3} />), dosument.getelementbyid('root');
```

class example

```js
import React from 'react';

class App extends React.Component {
  render() {
    return <div> </div>;
  }
}

export default App;
```

can also desconstruct

```js
import React,{component} from React
class App extends Component {  
  render() {
    return <div> </div>;
    }
  }

```
