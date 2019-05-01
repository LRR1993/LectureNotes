### ESLint

It is highly recommended that you use [ESLint](https://eslint.org/docs/user-guide/getting-started)
ESLint imposes a set of rules that your code has to follow.

**Advantages:**

- You will find bugs and errors before they happen.
- Makes code more consistent across developers - therefore easier to read.
- Can clean up commits (imagine if one person working on a repo had different rules for single / double quotes - looking through a git diff would be awful)

- Install: `npm install eslint --save-dev`
- Initialise: `npx eslint --init`
- Choose a styleguide to start off with (you can adjust the rules as we go along). Airbnb is good, especially with React.

You can also look at creating a [workspace settings](https://code.visualstudio.com/docs/getstarted/settings) file. This can make the preferences the same for any of the editors working on the project. Things like format on save and rules for [Prettier](https://prettier.io/).

### Git Hooks with Husky

[Husky](https://github.com/typicode/husky) allows us to easily add "git hooks" to our project.
Git hooks can prevent a bad push or commit from happening.

`npm install husky --save-dev`

These hooks will run the tests and linting (auto-fixing where possible) before each commit:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm t",
      "post-test": "eslint ./ --fix"
    }
  }
}
```