const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campaignSchema = Schema({
    verified: {
        type: Boolean,                 // not to send
        required: true
    },
    zakaatEligible: Boolean,
    startedBy: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    beneficiaryName: {
        type: String,
        required: true
    },
    baneficiaryType: {
        type: String                      // not to send
    },
    organizationName: {
        type: String
    },
    organizationWebsite: {
        type: String
    },
    pan: {
        type: String                     // not to send
    },
    taxStatus: {
        type: String                       // not to send
    },
    fundraiserName: {
        type: String,
        required: true
    },
    amountToRaise: {
        type: Number,
        required: true
    },
    story: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    imagePath: {
        type: Array,
        required: true
    },
    documentPath: [{
        docUrl: String,
        docCaption: String
    }],
    registeredUserData: {                // registration details of the person registered
        type: Object,                    // not to send
        required: true
    },
    noOfDonations: {
        type: Number                   // set afterwards
    },
    amountRaised: {
        type: String                      // set afterwards
    },
    video: {
        type: String
    },
    daysLeft: Number,
    endDate: {
        type: Date,
        required: true
    },
    bankName: String,
    accName:String,
    accNo:String,
    ifsc:String
});

const Campaign = mongoose.model('Campaign', campaignSchema);
module.exports = Campaign;


//=================================================
//                  QUERY FUNCTIONS BELOW
//=================================================

module.exports.registerCampaign = function (campaignData, callback) {
    campaignData.verified = false;
    campaignData.zakaatEligible = false;
    campaignData.amountRaised = 45000;
    let newFundraiser = new Campaign(campaignData)
    newFundraiser.endDate =+new Date() + 60 * 24 * 60 * 60 * 1000;
    newFundraiser.daysLeft =Math.floor((newFundraiser.endDate - new Date()) / (24*60*60*1000));
    Campaign.collection.insert(newFundraiser, callback);
}