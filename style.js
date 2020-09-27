const chalk = require('chalk');

const h1 = (text) => {
    return chalk.bold.underline.blueBright(text);
}

const q = (text) => {
    return chalk.yellowBright.italic(text);
}

const confirm = (text) => {
    return chalk.bgYellow.black.underline;
}

const clear = () => {
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    console.clear();
}

module.exports = {
    h1: h1,
    clear: clear,
    q: q,
}