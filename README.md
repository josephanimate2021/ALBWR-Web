<div align="center">
  <h1>
    The Legend Of Zelda: A Link Between Worlds Randomizer 
    <br>
    (Web Interface)
  </h1>
  <img src="https://github.com/user-attachments/assets/a1185a97-2e5f-4bde-901b-23836b2ca64e" alt="The Legend Of Zelda: A Link Between Worlds Randomizer">
  <p>A Node.js application meant to randomize your game using the original albw randomizer source codes and Node.JS's shell interface.</p>
  <h6>This branch is a version of ALBWR Web where you can host this online via a Docker Container on most websites that support it. 
    because of the linux support, you may only use versions down to 0.3.0 Dev Build 3 which isn't alot but is better than previous versions with less features and were more likely to make the game seed unbeatable anyway if you didn't understand how a game randomizer worked.
  Don't worry, i am aware that Docker also supports windows containers as well, so support for that will be coming soon. 
    This means that you will only be able to host this app on AWS if you wanted to host the app. If you are able to find any alteratives to AWS that also support windows containers, let me know by sending me a dm on discord at josephalt7000.</h6>
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
4. Once you think you've learned enough or didn't want to learn, that's fine. I'm only here to provide some building instructions for this project. Anyways, Open command prompt and then type in the following:
```bash
cd <project folder>
docker build .
```
Once you are done with that, the project should be built. If you get any errors along the way and it points to any errors that i have listed below, then those are likely the causes of your error.

###### no matching manifest for windows/[processor (CPU or Central Processing Unit) architecture] [windows version].[build number] in the manifest list entries
This error is caused by you switching to a Windows container and building this project with that container. The solution is to swtich back to the Linux Container (the default container) and you should be able to build the app just fine.

That's pretty much the entirety of the errors list, if you experience any errors along the way, feel free to send me a dm on discord at josephalt7000

## Hosting
These are the instructions for hosting your app on the following websites seen below.
### AWS Hosting
1. Create or login to your AWS account as a root or IAM user
2. Search for EC2 on the search bar and click on it when it comes up.
3. Under the Launch Instance box, click on the Launch Instance button.
4. On the Names and Tags box, name your instance to anything you want.
5. On the Application and Machine Images box, configure it to the best of your needs. I prefer that you stick with Amazon Linux because the next steps will be assuming that you are using Amazon Linux.
6. On the Instance type box, select anything that sticks with your plan. Assuming that your plan is a free tier, select anything that is Free Tier Elgiable
7. On the Key Pair box, select any pair you want to use. If there's none, create one to the best of your standards.
8. On the Network Settings box, be sure to check the boxes, Allow HTTPS/HTTP traffic from the internet.
9. On the Configure Storage window, choose the gigs of space and drive type that fits best to your standards.
10. Click on the "Launch Instance" button.
11. After your instance has been created, go to the box that says Connect to your instance and click on the Connect to instance button.
12. Click on the Connect button after you configure your instance to your standards.
13. Once in, you will see a terminal box. Please note that Amazon linux only has the yum package manager and not the apt one. So to install packages and update stuff, you would have to type in sudo yum [action] instead of sudo (apt or apt-get) [action] into the terminal every time.
14. Once youve gotten used to Amazon Linux, you are going to type in these commands into the terminal:
    ```bash
    sudo yum install git
    git clone https://github.com/josephanimate2021/ALBWR-Web --branch docker-container
    cd ALBWR-Web
    sudo amazon-linux-extras install docker
    sudo service docker start
    set BUILDNAME=[name you want]
    docker build -t BUILDNAME .
    docker run -p 80:3000 -t BUILDNAME
    ```
15. To tell whatever or not your container is running, navigate to your assigned public IP in your browser. If it's running, this application should come up. If not, then you must have done something wrong. Please reread the steps if you need to.
And that's all. I hope that there are no issues along the way.
### MS Azure Hosting
For Hosting on Microsoft Azure, you may watch this [youtube video](https://www.youtube.com/watch?v=GBl9CR8tlXk) to get an idea of how it's done. You just need to clone or download this git repository and you should be good to go from the details in the youtube video.
