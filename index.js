const RingCentral = require('ringcentral-js-concise').default
const Pubnub = require('ringcentral-js-concise/dist/pubnub').default
const delay = require('timeout-as-promise')
const moment = require('moment')

const rc = new RingCentral(
  process.env.RINGCENTRAL_CLIENT_ID,
  process.env.RINGCENTRAL_CLIENT_SECRET,
  process.env.RINGCENTRAL_SERVER_URL
)

const pubnub = new Pubnub(rc, ['/restapi/v1.0/account/~/extension/~/message-store/instant?type=SMS'], message => {
  handleMessage(message)
})

const handleMessage = message => {
  if (message.body && message.body.subject) {
    console.log(`Got message from customer: ${message.body.subject}`)
    const reply = getReply(message.body.subject)
    if (reply) {
      console.log(`Replying to customer: ${reply}`)
      rc.post('/restapi/v1.0/account/~/extension/~/sms', {
        to: [{ phoneNumber: message.body.from.phoneNumber }],
        from: { phoneNumber: process.env.RINGCENTRAL_USERNAME },
        text: reply
      })
    }
  }
}

const getReply = subject => {
  const input = subject.trim().toLowerCase()
  if (input.startsWith('hi') || input.startsWith('hello')) {
    return 'Hi, how can I help?'
  } else if (input.includes('order') && input.includes('arriv')) {
    return 'What is your order ID number?'
  } else if (/\d{3,20}/.test(input)) {
    return `Our records show that your order should arrive on ${moment().add(3, 'days').format('ddd, Do MMMM')} by noon. Is there anything else I can help with?`
  } else if (input.startsWith('no') || input.startsWith('nope')) {
    return 'Have a great day!'
  } else {
    return undefined
  }
}

const main = async () => {
  await rc.authorize({
    username: process.env.RINGCENTRAL_USERNAME,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD
  })

  await pubnub.subscribe()

  await delay(3600000)
  await rc.revoke()
}
main()
