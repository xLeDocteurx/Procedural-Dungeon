// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//

module.exports = {
  prompt: ({ inquirer, args }) => {
    const questions = []
    if (!args.name) {
      questions.push({
        type: 'input',
        name: 'name',
        message: 'Enter the name of Object :',
      })
    }
    questions.push({
      type: 'select',
      name: 'type',
      message: 'Specify type of object :',
      choices: ['characters', 'gui', 'items', 'debug', 'custom'],
    })
    return inquirer.prompt(questions).then((answer) => {
      console.log(answer)
      const { type } = answer
      const questions = []
      if (type === 'characters') {
        questions.push({
          type: 'select',
          name: 'folder',
          message: 'Type of Character :',
          choices: ['heroes', 'enemies', 'pnj'],
        })
      } else if (type === 'gui') {
        questions.push({
          type: 'select',
          name: 'folder',
          message: 'Type of GUI :',
          choices: ['game-ui', 'player-ui'],
        })
      } else if (type === 'items') {
        questions.push({
          type: 'select',
          name: 'folder',
          message: 'Type of Item ?',
          choices: ['weapon', 'consumable'],
        })
      } else if (type === 'debug') {
        questions.push({
          type: 'input',
          name: 'folder',
          message: 'Name your Debug Object :',
        })
      } else {
        questions.push({
          type: 'input',
          name: 'folder',
          message: 'Name your Custom Object',
        })
      }
      questions.push({
        type: 'select',
        name: 'gameobject',
        message: 'From which "GameObject" class to extend from?',
        choices: ['Sprite', 'Image', 'TileSprite', 'Blitter', 'Group', 'Zone', 'DynamicBitmapText', 'Graphics', 'None'],
      })
      return inquirer.prompt(questions).then((nextAnswers) => Object.assign({}, answer, nextAnswers))
    })
  },
}
