function difficultyToMMR(diff) {
    return 0.55 * diff * diff + 500
}

module.exports.difficultyToMMR = difficultyToMMR