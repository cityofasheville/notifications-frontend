# Notifications

This is the starter template for all City of Asheville React web projects. It contains the basic file structure, shared templates and icons (e.g., navbar, authentication, language components). It is intended to be paired with a back-end application based on the [GraphQL Starter Template](https://github.com/cityofasheville/graphql-starter-template).

It is intended to be used with (the notifications API)[https://github.com/cityofasheville/notifications-api], which is based on the city's backend starter template.

## Based on React Starter Template

This is based on the starter template for all City of Asheville React web projects. It contains the basic file structure, shared templates and icons (e.g., navbar, authentication, language components). It is intended to be paired with a back-end application based on the [GraphQL Starter Template](https://github.com/cityofasheville/graphql-starter-template).

To create a new React web app that derives from the starter template, create the new repo (e.g., NEW-REPO) and then:

````
git clone  https://github.com/cityofasheville/react-starter-template NEW-REPO
cd NEW-REPO  
git remote set-url origin https://github.com/cityofasheville/NEW-REPO
git remote add upstream https://github.com/cityofasheville/react-starter-template
git push origin master
````

If you are outside the City of Asheville organization, then you can just fork.

To build the API, run:
````
yarn
yarn start
````

City of Asheville applications should not fork but rather clone this project so that updates to the template can be pulled. The application-specific react code should all be added in the ```app``` subdirectory under src. Do NOT edit files inside the ```template``` directory inside a child repository!! Any changes to the template must be made in the react-starter-template project.


## To merge changes in this project into another project
1. git fetch upstream
1. git merge upstream/master --strategy-option theirs
