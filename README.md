# RingCentral SMS order checking bot

## Setup the project

```
yarn install
cp .env.sample .env
```

Edit .env to specify credentials


## Start the bot

```
yarn start
```


## Test the bot

Send sms to the phone number you configured in `.env` and talk to the bot.


## Sample conversation

```
Me: Hi
Bot: Hi, how can I help?
Me: When is my order arriving?
Bot: What is your order ID number?
Me: 1234567 Bot: Our records show that your order should arrive on Friday by noon. Is there anything else I can help with?
Me: Nope, thanks!
Bot: Have a great day.
```
