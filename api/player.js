const Profile = require('../models/profile')

class PlayerAPI {
    async getRank(userID) {
        const query = Profile.findOne({"UserId": userID});
        query.lean();
        const results = await query.exec();
        if (results == null) {
            return 0
        }
        return await Profile.countDocuments({ Rating: {"$gt": results.Rating} }) + 1;
    };
}

module.exports = new PlayerAPI()