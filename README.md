# Email Worker

Email worker is a background process that runs against email queue. It sends emails based on the data read in the queue

## Dependencies

Email worker uses a number of projects and dependencies to work properly:

- [NodeJS > v10.12](https://nodejs.org/en/download/ "node")
- [MySQL](https://dev.mysql.com/downloads/mysql/ "mysql")
- [DHIS2 Integration Mediator](https://github.com/BaobabHealthTrust/dhis2-integration-mediator)
- [DHIS2 Migration Worker](https://github.com/Kuunika/dhis2-migration-worker)
- [DHIS2 Fail Queue Worker](https://github.com/Kuunika/dhis2-fail-queue-worker)

## Installation

### step 1: clone the project

Clone this repository into your local directory, Use the commands below:

```sh
# clone project to a computer
git clone https://github.com/Kuunika/dhis2-email-worker.git

# navigate to the project root directory
cd dhis2-email-worker
```

### step 2: dependencies installation

Install all the dependencies

```sh
# install dependencies
npm install
```

### step 3: environmental variables

Create a `.env` file with the contents of your .env.default file.

```sh
# copy the .env.example to .env file
cp .env.default .env
```

Modify the `.env` file and make sure it reflects the environment settings.

### step 4: start the work

```sh
# start the worker
npm start
```
