# Proxer Watchlist Push, the simple version
Send a push notification via pushbullet once a new EP of an anime on your watchlist is available. The application checks (by default) every 30min if a new one is available, so it is not instant.
You can, if you want to, specify the time at which the application should check in the config (see below).

## Simple version?
The reason being that this version does not require PhantomJS like the other version does. This makes it inherently more simple as it's one less thing a user would need to install in order for him to use it. However, this comes with its own problems. One of those things being that here we don't actually have a proper browser, meaning that cloudflare is really likely to identify this and block it. If you want to still use this system, but aren't afraid to use something a bit more complicated setup, please take a look at the ['harder' version](https://github.com/kumpelblase2/proxer-watchlist-push).

## Limitations
Since proxer.me does not provide an API (at least not yet), this applications parses HTML directly and thus might break if the site design/layout changes. The application also requires you to specifiy the username and password of the user you want to get notifications for. Again, proxer.me does not provide an API so this application has to it the same way a human would do. However, the application tries to not needing to login every time and thus stores the cookie provided by the server and will use that instead for following requests. The cookies are stored in the `cookies.json` file if you want to take a look.

Lastly, CloudFlare protection. As mentioned above, you will probably encounter problems here. I might be proven wrong, but I just don't want to get peoples hopes up, with this version.

## Configuration
The configuration can be found in the `config.js` file at the root directory.
Settings to change:
- pushbullet_key: the API key for your pushbullet account. This can be found at your account settings page at pushbullet.
- username: the proxer.me username
- password: the password for the proxer.me user
- minutes: A list of minutes this application should be run at. E.g. if you set it to `[10, 40]` it would run every hour at minute 10 and 40 (8:10, 8:40, 9:10, 9:40, etc.). You can specify every minute if you like, but I would suggest you make at least a 5 minute pause between to not put too much strain on their servers (especially on the weekends).

## Installation
(If you haven't already, either clone this repository or download the [zip](https://github.com/kumpelblase2/proxer-watchlist-push/archive/master.zip) of this repository.)

First, run `npm install` to fetch the dependencies.

Now, change the settings accordingly (see [the config section](#configuration) above).

Lastly, run `npm start` to start the application and you're all set.

## License
The software is licensed under the MIT license. A copy can be found in the `LICENSE` file inside this repository.
