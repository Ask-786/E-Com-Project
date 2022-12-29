const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE;
const client = require("twilio")(accountSid, authToken);

client.verify.v2.services
  .create({ friendlyName: "Persuit" })
  .then(() => console.log("OTP Ready"));

function sendVerifyToken(mobile) {
  return new Promise((resolve) => {
    client.verify.v2
      .services(serviceId)
      .verifications.create({ to: `+91${mobile}`, channel: "sms" })
      .then((verification) => {
        resolve(verification.status);
      });
  });
}

function checkVerificationToken(mobile, code) {
  return new Promise((resolve) => {
    client.verify.v2
      .services(serviceId)
      .verificationChecks.create({ to: `+91${mobile}`, code: code })
      .then((verificationCheck) => {
        resolve(verificationCheck.status);
      });
  });
}

module.exports = {
  sendVerifyToken,
  checkVerificationToken,
};
