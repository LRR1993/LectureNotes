# Setup

# How to setup an OSX dev environment

Copy and paste this command into your terminal.

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" && brew install node && brew install postgresql && brew install zsh zsh-completions && sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

```
Then hit return.

This will install the following things:

- [Brew](https://brew.sh/) 
- [Node](https://nodejs.org/en/)
- [PSQL](https://www.postgresql.org/)
- [zsh](https://www.postgresql.org/)
- [oh-my-zsh](https://ohmyz.sh/)

### Install slack
### Install chrome
### Install Markdown 
https://chrome.google.com/webstore/detail/markdown-here/elifhakcjgalahccnjkneoccemfahfoa


## A Better Terminal Application
Type the following commands to install a terminal application called Terminator, which allows you to have multiple terminal instances in one window:

$ sudo apt-get update

$ sudo apt-get install terminator

#### Install VSCODE
```
reactjs code snippets
eslint
prettirt
live server
npm intellisense
chai snippets
mocha snippets
jest snippets
```

#### Install Homebrew

```
Run this command on your terminal application to install Homebrew:

~/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

Update Homebrew:

brew update
```

#### Install Git

```
See if you already have Git by running:

git --version

'If you already have Git it will tell you a version number.'

'If you do not see a version number, install Git with Homebrew:'

brew install git

$ git --version

'again to confirm Git has been installed'.
```

#### Install NVM (Node Version Manager) and Node

So far you could only run JavaScript code on a web browser, attached to an HTML page. Node.js allows us to run JavaScript code directly from our terminal. We'll use Node.js extensively during the course and on the Precourse so it's important to have an up-to-date version installed.

```
Run this command in your terminal to install Node Version Manager which allows you to easily download the latest version of Node, and switch between versions at a later date if you need to:

`$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash`

Check it has installed correctly by typing this command on the terminal:

`$ nvm --version`

Again, if you see a version number you are good.

Now install Node using NVM:

`$ nvm install node`

`$ nvm use node`

`$ source ~/.nvm/nvm.sh`

You may need to quit and reopen your terminal application before you see it has been successful. To check success, type:

`$ node --version`

If you have an earlier version than 6, type:

`$ nvm install 8.6.0`

`$ nvm use 8.6.0`

`$ node --version`

Now you should see that you are using Node version 8.6.0
```

#### Install PostgreSQL

PostgreSQL is another database we'll use during the course. Again, don't worry if this doesn't seem to go as you planned, you won't need it for the Precourse and we can sort you out at the install session!

Install the Postgres app by going here and downloading it:

[Get Postgres.app](https://postgresapp.com/)