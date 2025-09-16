# Base 1024 encoding using emojis

This is a fun little client side React application that can encode text or files to emojis and back again. It works entirely in the browser, supports both text and file input, and is built with React and TypeScript. Try it out [here](https://emoji.rahka.net/).

## What is this?

The project is inspired by how Base64 encoding works, but instead of 64 symbols it uses 1024 symbols.  
With 10 bits per block we can map directly to a set of 1024 emojis, making it possible to represent binary data using colorful characters.

- **Base64:** 6 bits → 64 characters  
- **Base1024:** 10 bits → 1024 emojis  

This allows for more compact encodings and, of course, makes the result much more fun to look at and share.

This is how the readme (excluding this part) looks like when its emoji encoded, go ahead and try decoding it!

💋️🥗️💤️🐾️🐠️🥣️🥺️😴️👁️🧈️🦙️🏢️☘️🫙️🧱️🏦️❣️🥽️👨️🦥️🐛️🧈️🦙️🦦️🦠️🚍️💪️🍘️🐄️🎡️🪨️🏈️🦂️🎽️😜️🤸️🪸️🕶️📯️😺️🦂️♥️🏊️🤡️❣️🍹️🥉️🐰️🌴️🧸️🤗️👛️🐬️🗻️😙️🏤️🦜️🍺️💆️😈️🍃️🎈️🥉️🐀️🦜️♠️🧱️🩴️❣️♠️🥠️🦃️❣️🍹️😫️🍧️🐡️☁️🧔️🩱️🐠️🧂️🏄️🐤️🍑️🧈️📨️🍧️🪸️🚌️🥈️🐾️❣️♠️📃️🤡️🌱️☔️🚑️🐾️❣️🍡️🎻️🤫️🦎️🍡️👨️🏈️🦜️🕍️😩️🦥️👏️🥗️🪵️🤫️🌶️⛱️🤚️👠️❣️🏝️📱️👽️🍋️🏝️🏀️🤸️🦂️⭐️🤭️👻️🐠️🧈️✋️🏰️🌶️🎯️🦒️🍯️❣️🪀️🦒️😼️☘️🏒️⛹️🏈️🦎️⛱️🚣️🤫️🍒️🏞️🦑️🤫️🦜️☁️💆️👹️🦂️🛩️🐴️👽️🌴️🎉️🐘️😬️❣️🍡️🎻️🤫️🦂️🎽️😜️🛕️🦂️🛫️💆️🙊️🦂️♠️🥫️😥️🐡️🍡️🧓️🤫️🦜️☁️💆️😭️🫘️🎈️🐗️🥻️🍋️🚍️🤭️😌️❣️🐆️🫱️🤸️🦂️🧸️🤑️🩰️🍑️🍿️🌙️🤡️🍋️🏜️♟️👻️🍒️♥️🤗️🎱️🤲️☔️🦙️🦦️🦠️🚊️🪘️🏠️🦗️🛞️😳️🏯️🐡️🧸️📄️👤️🫥️👌️🦻️🏈️🐘️🎡️😤️🤫️🦂️🎽️🤭️👻️🦂️🎿️📗️🍘️🐄️🎡️🐴️😼️🍋️☔️🚐️🐀️🍑️🧈️🪨️🏈️🦂️⛅️👩️👽️🍋️🏝️💆️👿️🥜️🧈️🦞️👑️❣️😑️🥱️🩲️🧑️🧸️🤪️🦥️🦕️☔️🚣️🦥️🐛️🧂️🥕️🥿️🪷️🎽️🎊️👿️🍅️🧸️😝️🦥️🍎️♠️🐐️🐹️❣️☔️🐢️🤢️👁️🧂️👴️🐼️🦎️☔️⚾️🏈️🦂️🧸️🤭️🐾️🐡️🎽️😊️🫂️🦻️🧸️🤗️🎩️🌱️🧁️📧️😿️👏️🫕️😄️🏞️🦂️♠️🥫️🤤️💅️🧈️🤚️🦃️🥭️🧂️🤪️🦡️❣️🧁️⚽️🥻️💮️🧂️🍆️🤸️🦕️🍡️📯️😸️🦜️🎆️🤪️👽️🍋️🏝️🧓️😺️🥜️🧂️🏊️🏈️🦚️🧂️👱️🦃️❣️☔️🐢️🤤️💅️🥏️💆️🤡️🌱️☔️🚑️🐾️☝️🧈️🥼️🐻️🦂️☁️🍊️👽️🍑️🧂️🤑️👠️🍎️🚌️🖐️🤡️❣️♠️📃️🙀️🐡️🎉️👋️🐾️🐡️⛅️💆️👿️🦂️☁️🥱️⛲️❣️🫙️😤️😈️❣️🥽️👨️🦥️🐛️🧈️🧔️🛍️☘️🏑️🐜️🐨️❣️🍹️🥠️🦡️🦜️🍺️🏄️🦡️🥭️🌞️🌉️🍼️💟️🚙️🚈️🏠️🍎️🏕️🦕️🥶️🤟️🚙️😇️🍧️🦎️🚍️⛹️🏈️🔕️👽️💜️🤢️👁️🧈️👨️😈️🍋️🍡️🧓️🤡️🍋️🎽️🙂️🫠️✊️🫕️🚂️🍽️🦜️🎯️🦌️🫂️🦻️🪅️🚂️🍭️💟️🎟️🙂️👿️🦂️♥️🦻️🙅️🦀️🤽️😊️🫂️🦻️🧸️🤪️🐼️☘️🚜️🪨️🏈️💟️🫳️🚋️👻️🦂️🎽️😜️🐨️🌺️⛱️🌽️🏈️🪸️⛱️💜️😸️☘️🏑️🐴️💀️☘️⏰️😜️🐀️🍑️🧈️🦙️🏢️☘️🫙️🧱️🏦️🥭️🧈️😫️🏣️☝️🧈️💹️🍧️🦕️⛱️🦒️⛪️🐠️⛴️🤑️🐭️🪷️🏞️🦻️😾️🦗️🗻️🤗️🏤️🍎️🕶️🥎️🤫️🌱️🕶️👨️🤫️🌱️⛱️👋️🤸️🪸️🕶️📯️😾️🌿️🧈️⚽️👞️💮️🧈️😤️🤫️🦜️☁️💆️😿️🦗️🥟️👋️👤️
