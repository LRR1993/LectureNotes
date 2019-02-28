_Typical git commands_

Add the URL for the remote repository where your local repository will be pushed.

```js
git remote add origin remote repository URL
//Sets the new remote
git remote -v
//Verifies the new remote URL
```

push an existing repo from CLI EG

```js
git remote add origin https://github.com/LRR1993/LectureNotes.git
git push -u origin master
```

push changes to origin master
```js
git push -u origin master
//Pushes the changes in your local repository up to the remote repository you specified as the origin
```

create a new repo on CLI

```js
echo "# LectureNotes" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/LRR1993/LectureNotes.git
git push -u origin master
```
