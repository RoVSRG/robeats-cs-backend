class Player {
    async getRating(topScores) {
        var rating = 0;
        var maxNumOfScores = 25;
        for (var i = 0; i < maxNumOfScores; i++) {
        if (topScores[i] != null) {
            if (i <= 10) {
                rating = rating + topScores[i].Rating * 1.5;
            } else {
                rating = rating + topScores[i].Rating;
            }
        }
        }
        var plr_rating = Math.floor((100 * rating) / 30) / 100;
        return plr_rating;
    }
}

module.exports = new Player();
