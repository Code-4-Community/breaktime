# breaktime

![](https://static.wixstatic.com/media/1193ef_371853f9145b445fb883f16ed7741b60~mv2.jpg/v1/crop/x_0,y_2,w_1842,h_332/fill/w_466,h_84,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Breaktime%20Logo%20Comfortaa-2.jpg)

# Breaktime Frontend 

This repo contains all the code for the backend of Project Breaktime, a project developing a time-tracking dashboard. This project utilizes a ReactJS (Frontend) and NodeJS (Backend). 
## Installation 

To setup this project ensure that you currently have react installed. 

[Install React](https://legacy.reactjs.org/docs/getting-started.html)

Once installed, all that is needed to install all required dependencies is the following line: 
```
npm install
```
You should now be ready to start running things! 

*Note*: If you are missing a file in `src/aws-exports.tsx` reach out to the tech-lead for this file, or copy `aws-exports.js` into this name. 


## Running the Project

To run the frontend several steps are required: 

1. 
    Run the following command: ```npm start``` After this you should see a browser open to `localhost:3000`. 

2.  
    Start the backend - for instructions see [breaktime-backend](https://github.com/Code-4-Community/breaktime-backend) under the c4c repo. Once this is running you should be able to start interacting with the website. 

3. 
    From step 1 you should be greeted with a log-in window asking you to sign in with a user name and password. These can either be provided by asking anyone on the breaktime team, or by navigating to the Cognito pool for breaktime and creating this yourself: *Ask a developer on project breaktime for instructions on this*

Once logged in, you should be ready to go and interact with the website. 


## Code Overview 

The frontend is using a typescript / react and currently utilizes AWS Amplify for handling authentication. 

### Reading Material 

* [What is a frontend?](https://www.freecodecamp.org/news/front-end-developer-what-is-front-end-development-explained-in-plain-english/)
* [Introduction to AWS Amplify](https://docs.amplify.aws/)
* [Introduction to React](https://react.dev/learn)


### Codebase Design

Important directories and files are described below. While not all files are described, these provide a general overview of the structure. 
```

breaktime-frontend/
├─ public/ - Static assets that should exist on the frontend 
├─ src/ - Directory housing almost all code 
│  ├─ components/ - React Component Modules 
│  |  ├─ Auth/ - Authenticated API interface and components 
|  |  |  ├─ apiClient.tsx - The central interface making authenticated calls to the backend. 
│  |  ├─ HomePage/ - Components for the landing & home page 
│  |  ├─ NavBar/ - Components for the navigation bar 
│  |  ├─ SignOut/ - Components for the signout page 
│  |  ├─ TimeCardPage/ - Components for the timesheet page 
|  |  |  ├─ CellTypes/ - Contains all types of cells rendered on the timesheet 
│  ├─ schemas/ - Typescript schemas for complex data types 
│  ├─ aws-exports.js - AWS configuration file for Cognito 
│  ├─ constants.tsx - Frontend global constants file 
│  ├─ index.css - styling for root of the project 
│  ├─ index.tsx - root JS file 
├─ .gitignore - files ignored by git 
├─ package.json - react project configuration files 
├─ README.md
```

![](https://static.wixstatic.com/media/1193ef_371853f9145b445fb883f16ed7741b60~mv2.jpg/v1/crop/x_0,y_2,w_1842,h_332/fill/w_466,h_84,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/Breaktime%20Logo%20Comfortaa-2.jpg)

# Breaktime Backend
This repo contains all the code for the backend of Project Breaktime, a project developing a time-tracking dashboard. This project utilizes a ReactJS (Frontend) and NodeJS (Backend). 

## Installation 
To fully setup the backend follow these steps:

Nagivate to the root of this repo and run the following command 

1. Ensure [node](https://nodejs.org/en/download) and [react](https://legacy.reactjs.org/docs/getting-started.html) are installed. 

2. Run the following command to install all necessary packages. 
    ```
    npm install
    ```
3. Next create a file at the root of the project named `.env`. Ask a member of the development team on breaktime for the contents of this file. These are the private tokens required to run certain parts of the backend (Connecting to the Database, etc). 

4. Now run `npm start` and ensure that no errors show up, if you do not get any errors in the startup everything is successfully running!


## Reading Material 
To learn more about the various technologies utilized here you can read more about them below: 
* [What is backend development?](https://www.upwork.com/resources/beginners-guide-back-end-development#what-is)
* [NestJS](https://docs.nestjs.com/) : The framework utilized for our backend endpoints 
* [AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) : What is used for our user authentication

## Code Overview: 
Our file structure is outlined below, while not all files are documented here these are several important ones for our design: 

```
breaktime-backend/
├─ src/ - Directory housing almost all code 
│  ├─ aws/
|  |  ├─ cognito/ AWS Coginto modules for various functionality 
|  |  ├─ decorators/ Decorators for role-based functionality 
|  |  ├─ middleware/ Functionality for actually authenticating a user 
|  |  ├─ auth.controller.ts - Endpoints requiring authentication through AWS Cognito 
|  |  ├─ auth.module.ts - Nest configuration file 
|  ├─ db/ Modules containing database functionality 
|  ├─ users/ Modules for users 
|  ├─ utils/ Utility modules 
|  ├─ app.module.ts 
|  ├─ constants.ts - Global constants 
|  ├─ dynamodb.ts - Main interface for interacting with database 
|  ├─ main.ts - main method / root of the project 
├─ test/ - Directory containing test files 
|  ├─ UploadTimesheet.ts - A file used in debugging to upload arbitrary timesheets 
├─ .gitignore - files ignored by git 
├─ package.json - project configuration file 
├─ README.md
```
