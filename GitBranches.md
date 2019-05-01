## Branches

Branches are a better way to maintain responsibility within your code and make it easier to keep track of what is happening and the different features people are working on.

- To create a new branch locally, `git checkout -b new-branch`. -b tag means this should be a new branch.

- Give this branch a short name representing the feature you are implementing.

- We can make changes, add and commit code that relates to this feature, as many times as we like.

- When we are happy with the feature and that it should become a permanent feature of our application, then it is time to push it up to github: `git commit origin new-branch`.

- On Github, recent branch pushes are flagged at the top of a repo (or you can go to the branches menu to see activity). We have the option to make a pull request - think of this as asking permission for your code to be pulled into the master branch, rather than pushing your code in.

- Assuming there are no merge conflicts (you'll have to pull in the code and sort them out first if there are, or else use the Github console if it's simple enough) you might be tempted by the big green merge button - but much better to seek approval from someone else. Request a review, leave a nice simple message, and assign someone to look at it.

- That person can take a look at the code, and either comment, approve or request changes. When we get round to protecting our branch later, we can specify that approval is necessary for merging to happen.

- The original pull-requester is now free to merge in! You can safely delete the branch - it's not gone forever should it come to it, but it stops it clogging up your branch list.

- Now the code is pushed in on your github remote, but you want your local machine to reflect that. `git checkout master` will take you back to the master branch. `git pull origin master` will get in the changes from Github, so you are up to date locally. You can delete the branch locally with `git branch -D new-branch`.

# Stay safe

You should think of your master branch as production ready code. It's up to you to decide exactly what that means, but a guide might be code that you could deploy and it would work fully within the limitations of whatever features you had covered. Certainly, you don't want to risk non-functioning code getting into the master branch. But you will want to have more granularity in your commits and pull requests than this would allow, so we recommend the following set-up as a compromise.

- The first thing you should do on starting a project after cloning to your local machine is set up a 'dev' branch. Consider this where you want to operate from up until you have completed a feature that is ready to deploy.

- Then push your dev branch to Github. This will make it available for other people to pull, and branch off from themselves.

- Now is a good time to add some extra protections. On settings -> branches, we want to first set our default branch to 'dev'. This means when we make pull requests, Github will assume we want them to go into dev, not master, reducing the risk of accidentally commit unready code to the master branch.

- We should also enable some protections to master and dev. The first is to require approval on pull requests before merging. The person who approves the code should not be the person who wrote it! Ideally you pull in another pair to do this, but sometimes, when that's not possible, one of your pair can submit the request, and the second should read it to approve. It's also a good idea to extend these restrictions to administrators whilst we're here - so nobody is above the law!

- Back on your local machine, you are now able to create branches off dev instead of master, as per the processes outlined above.

# Rebasing

Rebasing is an alternative to merging. Instead of amalgamating to commit histories from two different branches so as to reflect the time the commits were made, it restructures the commit history so that one branch's features appeared to have based from another. This is great for when two people are working on two branches from the same root simultaneously.

You can see this more visually and look at some of the pros and cons of merging and rebasing on [https://www.atlassian.com/git/tutorials/merging-vs-rebasing](Atlassian's page on this matter).

# Project responsibilities

A major consideration of any project is having clarity of who is working on what aspect or feature at any one time. You want to be able to determine this whether you are at home, somebody else is at lunch, they're off sick, without calling an unnecessary meeting etc etc.

A clear delineation of responsibilities means a clear delineation of tasks is required. A common first step in this process is to define 'user stories', or short, non-code-related sentences that take the form 'as role x, I want my app to have feature y' (or similar). Think of this as something that could be shared with, or even constructed by, a company's upper management outside of its tech department.

As a dev team, you will then want to convert these User Stories into implementable features, or subtasks that will lead to this. Kanban is an Agile methodology which gives some structure to this. It's very popular in the wider world and Github has a preset for this via their 'Projects' feature. (Trello is another tool people make wide use of for this).

- Whilst on a repo that will contribute to your project, select Projects from the menu. You can create your own setup, but under templates, 'Basic Kanban' is available (and some others).

- On the Projects view, you can create cards. Think of each one as a task - could be to research something, spike something, create a feature, style or whatever. But it should be clear and self-contained.

- You can convert a card to an 'issue', Github's mechanism for highlighting something that could be addressed. If you do this, you can connect it to a repo (bearing in mind that codebases that dont' touch each other, like FE and BE, should have separate repos) and assign people to it.

- If you adopt the Kanban style, your Backlog should represent all the tasks that need doing to move your Project to the next stage, e.g. a minimum viable product to start with. The 'Now' and 'Next' columns represent what a dev is working on and will be next - this should be the point at which roles are assigned. At the point of Reviewing, make your pull request, move your card, and assign somebody new!

- Outside of the tech available, remember that communication is key! Sometimes this is within a meeting - particularly common is to hold a 'stand up' at the start of each day, where each team member relays what they've been working on, the issues that are preventing them from progressing, and what they intend on doing that day. But Kanban / project boards are about giving constant accountability and oversight without requiring these meetings constantly.