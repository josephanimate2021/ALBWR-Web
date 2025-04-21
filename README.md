<div align="center">
  <h1>
    The Legend Of Zelda
    <br>
    A Link Between Worlds Randomizer 
    <br>
    (Web Interface)
  </h1>
  <img src="https://github.com/user-attachments/assets/a1185a97-2e5f-4bde-901b-23836b2ca64e" alt="A Link Between Worlds">
  <p>A Node.js application meant to randomize your game using the original albw randomizer source codes and Node.JS's shell interface.</p>
  <h6>I am aware of an already existing <a href="https://github.com/rickfay/z17-randomizer/tree/webapp">web app</a> being put in the works, but this source code will serve as an alternative for the time being until the actual app is stable enough for production (i might need to keep this source code up just in case though + it has some better features over the original webapp anyway).</h6>
</div>

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

You may have seen videos of people playing The Legend Of Zelda: A Link Between Worlds Randomizer on youtube and said to yourself:<br>
`I want to play the randomizer for myself to see what the hype is about.`
And this is where this source code, including the actual albw randomizer source codes come in. You may use all to your advantage to randomize your legally dumped North America Rom file of A Link Between Worlds. Read below for more instructions.


## How It Works

The source code takes the info from the Web UI and hands it off to either the z17 or albw randomizer source codes and uses Node.JS's shell interface to tell the source codes to randomize away with provided user input. For an idea of how your game will get randomized, you may click [here](https://github.com/rickfay/z17-randomizer/tree/master?tab=readme-ov-file#running-the-randomizer).


## Features

- Original settings are fetched from the z17 and albw randomizer source code presets (and user presets as well) so that it's easier for you to change them without having to modify their files locally.
- Uploads your rom file into chunks for the server to process and then the server turns those chunks back into a single file to make for a fast and efficient file uploading process using some of the files from [isaka's source code](https://github.com/isaka-james/chunks-to-file) to do some of the work.
- Allows you to select which source code version is used to randomize your game.
- Allows you to share your own setting presets with anybody if you wanted to.
- Simple and easy-to-use interface.


## Installation

To use this application, follow these steps (Please Install [Node.JS](https://nodejs.org) if you haven't already in order for this application to work for you):

1. Clone the repository:

   ```bash
   git clone https://github.com/josephanimate2021/ALBWR-Web.git
   ```
   On side note, you can also download this source code as a zip file by going to Code -> Download ZIP and then extracting the downloaded zip file to get the same outcome.

2. Enter into the project folder:

   ```bash
   cd ALBWR-Web
   ```
3. Install the dependencies:
```bash
   npm install
```

## Usage (YOU ONLY NEED TO DO STEPS 3, 4, 5, AND 6 ONCE BECAUSE AFTERWARDS THE APPLICATION WILL LOAD THE RANDOMIZER PAGE BY DEFAULT)

1. Start the server:

   ```bash
   npm start
   ```
   
2. Open your web browser and navigate to `http://localhost`.
3. Select a rom file to upload using the provided input field.
4. Click the "Upload" button to initiate the rom file upload process.
5. The server will receive the file chunks and combine them into a single file inside the `uploads` folder.
6. Once the file is uploaded, you will be shown a list of options you can change to randomize your game.
7. Once all of the options are selected, you may click on the "Randomize Game" button. From there, the server will know that your game is ready to be randomized and will trigger either one of the randomizer executables to randomize your game based off of the selected executable version.
8. Once your game is randomized, you will get a download link of the randomized game where you can use the files to play the randomized copy of your game. You may refer [here](https://github.com/rickfay/z17-randomizer/tree/master?tab=readme-ov-file#installing-seeds) if you need help installing your randomized game seed.

## Contributing

If you want to make any contributions to my code, that's great. Contributions are welcome! You may either DM me your email address on discord at josephalt7000 to get contribution access to this repo (please specify the reason on why you want to contribute) or creating a fork of this repo, make any changes you want to the source code, and then send a pull request to this repo. I do need to note that this isn't for everybody though, and should only be done if you have coding knowledge with the following languages:

1. HTML (Hyper Text Markup Language)
   Knowledge of this language is required if you plan on making changes to the HTML files that serve the pages to the user. If you don't know HTML, things can go wrong and no one wants that.
2. CSS (Cascading Style Sheets)
   Knowledge of this language is required if you plan on making changes to the styling of the pages that get served to the user, The UI isn't going to look it's best if you have no experience with CSS.
3. JS (Javascript)
   Knowledge of this language is required if you plan on making changes to the behavior of the pages that get served to the user. The page may not behave as expected if you have no experience with JS

This repo was created using Node.JS. so no worries if you have fear that i may have missed something (unless i actually did).

## License

This project is licensed under the [MIT License](LICENSE).
