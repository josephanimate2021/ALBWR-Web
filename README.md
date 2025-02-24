<div align="center">
  <h1>
    The Legend Of Zelda: A Link Between Worlds Randomizer 
    <br>
    (Web Interface)
  </h1>
  <img src="https://github.com/user-attachments/assets/a1185a97-2e5f-4bde-901b-23836b2ca64e" alt="The Legend Of Zelda: A Link Between Worlds Randomizer">
  <p>A Node.js application meant to randomize your game using the original albw randomizer source codes and Node.JS's shell interface.</p>
  <small>This branch is a version of ALBWR Web where you can host this online via a Docker Container on most websites that support it. because of the linux support, you may only use versions down to 0.3.0 Dev Build 3 which isn't alot but is better than previous versions with less features and were more likely to make the game seed unbeatable anyway if you didn't understand how a game randomizer worked.
  Don't worry, i am aware that Docker also supports windows as well, so support for that will be coming soon.</small>
</div>

## Table of Contents

- [Instructions](#instructions)
- [Building](#building)
- [Hosting](#hosting)


## Instructions

Most of the instructions are located in the main branch of this repository. But for building and hosting, i will provide instructions for those.

## Building

1. Download Docker from the [offical website](https://www.docker.com/).
2. Launch the Docker Installer file you just downloaded and do what the steps ask you until Docker is fully installed to your computer.
3. Open Docker for the first time. If you can, try to learn some stuff while you're there.
4. Once you think you've learned enough or didn't want to learn, that's fine. I'm only here to provide some building instructions for this project. Anyways, Open command prompt and then type in the follwing
```bash
cd <project folder>
cd ../
docker build ALBWR-Web
```
Once you are done with that, the project should be built. If you get any errors along the way and it points to any errors that i have listed below, then those are likely the causes of your error.

###### no matching manifest for windows/amd64 10.0.[build number] in the manifest list entries
This error is caused by you switching to a Windows container and building this project with that container. The solution is to swtich back to the Linux Container (the default container) and you should be able to build the app just fine.

That's pretty much the entirety of the errors list, if you experience any errors along the way, feel free to send me a dm on discord at josephalt7000

## Hosting
Once i figure out the best way to host this app, i will provide instructions below.
