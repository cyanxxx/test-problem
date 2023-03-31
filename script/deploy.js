import childProcess from "child_process"

function deploy() {
  const msg = childProcess.execSync('git log -1 --pretty="%h:%s %cd"')
  const msgCommand = ((msg) => `git commit -m "Deploying ${msg.toString().replace(/[\r\n]/, '')}" --quiet`)(msg)
  const splitCommands = [
    'git add -f dist',
    `${msgCommand}`,
    `git subtree split --prefix dist -b gh-pages`,
    `git push origin gh-pages:gh-pages --force`,
    `git branch -D gh-pages`,
    `git reset --hard HEAD~1`,
  ]
  childProcess.exec(splitCommands.join('&&'), (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      childProcess.execSync('git reset --hard HEAD^')
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  })
}

deploy()