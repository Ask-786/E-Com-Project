const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE;
const client = require("twilio")(accountSid, authToken);

client.verify.v2.services
  .create({ friendlyName: "My First Verify Service" })
  .then((service) => console.log("OTP Ready"));

function sendVerifyToken(mobile) {
  return new Promise((resolve, reject) => {
    client.verify.v2
      .services(serviceId)
      .verifications.create({ to: `+91${mobile}`, channel: "sms" })
      .then((verification) => {
        resolve(verification.status);
      });
  });
}

function checkVerificationToken(mobile, code) {
  return new Promise((resolve, reject) => {
    client.verify.v2
      .services(serviceId)
      .verificationChecks.create({ to: `+91${mobile}`, code: code })
      .then((verification_check) => {
        resolve(verification_check.status);
      });
  });
}

module.exports = {
  sendVerifyToken,
  checkVerificationToken,
};
