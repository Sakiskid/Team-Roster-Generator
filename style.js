const chalk = require('chalk');

const h1 = (text) => {
    return chalk.bold.underline.blueBright(text);
}

const h2 = (text) => {
    return chalk.bold.cyan(text);
}

const small = (text) => {
    return chalk.italic.gray(text);
}

const q = (text) => {
    return chalk.yellowBright.italic(text);
}

const confirm = (text) => {
    return chalk.bgGray.red.underline(text);
}

const clear = () => {
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
    console.clear();
}

module.exports = {
    h1: h1,
    h2: h2,
    small: small,
    clear: clear,
    q: q,
    confirm: confirm,
}