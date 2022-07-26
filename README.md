# LABORATORY-NX-NATS

```
Note:
This project has to be compared to the LABORATORY-NX-TCP
https://github.com/JustalK/LABORATORY-NX-TCP
```

![Alt text](Documentation/Graph.png?raw=true "Graph NX")

This project has been created using the libraries **NX** for creating a monorepository of microservices. Each microservices has been built with the CLI of NX as a **Nest.js** microservice. They communicate with the client using the **server NATS** and the message pattern of Nest.js.

## Plan of the presentation

I explain with all the details how I build the project and my way of working.

- [Development](#development)
- [NX](#NX)
- [Running](#Running)

## Development

There are 3 apps and the server NATS:

- **client:** A nest.js client
- **microservice1:** A nest.js microservice
- **microservice2:** A nest.js microservice
- **Nats:** The message broker

When the api call one of the endpoint of the api, the service of the `client` is called. Inside the method, a message is sent to the server Nats. The message is put in the queue either microservice1_queue or microservice2_queue depending of the endpoint. Once the message is treated, he is sent to the microservice. The controller of the microservice has a MessagePattern matching the one from the send, the method will be exceuted and the response sent back to the message broker. And from the message broker sent to the client as a response for the endpoint.

The communication is using the centralized Nats transporter. A simple image for illustrating what is a centralized communication:

![Alt text](Documentation/Centralized.svg?raw=true "Centralized TCP")

### Nats

The server Nats has been implemented with docker-compose.

```yml
version: "2"

services:
  nats:
    image: 'bitnami/nats:latest'
    hostname: laboratory-nats-server
    container_name: nats
    ports:
      - 4222:4222
      - 6222:6222
      - 8222:8222

```

### Client

In the `app.module.ts`, we register the two microservices using the same transporter and port used in the microservices.

```js
ClientsModule.register([
  {
    name: 'MICROSERVICE1',
    transport: Transport.NATS,
    options: {
      url: 'nats://nats:4222',
      queue: 'microservice1_queue',
    },
  },
  {
    name: 'MICROSERVICE2',
    transport: Transport.NATS,
    options: {
      url: 'nats://nats:4222',
      queue: 'microservice2_queue',
    },
  },
])
```

We inject our microservices using the ClientProxy inside our service `app.service.ts` with their respective name.

```js
constructor(
  @Inject('MICROSERVICE1') private client1: ClientProxy,
  @Inject('MICROSERVICE2') private client2: ClientProxy
){}
```

For sending a message to a particular microservice, we can next using our injected variable.

```js
// Example: sending a message 'microservice1.greeting' with 'Micro1' as a parameter to microservice1
return this.client1.send({cmd: 'microservice1.greeting'}, 'Micro1')
```

### Microservices

Register, the app has a Nest.js microservice:

```js
const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  AppModule,
  {
    transport: Transport.NATS,
    options: {
      url: 'nats://nats:4222',
      queue: 'microservice1_queue',
    },
  },
);
```

In the `app.controller.ts`, we use the decorator `MessagePattern` to indicate that a controller is waiting for a message from the client

```js
@MessagePattern({cmd: 'microservice1.greeting'})
getGreetingMessage(name: string): string {
  return `[MICROSERVICE 1] Hello ${name}`;
}
```

## NX

### Create a new application Nest

```bash
$ nx generate @nrwl/nest:application <Name of app/microservice>
```

### Create a new service inside the app todos

```bash
$ nx generate @nrwl/nest:service <Name of service> --project <Name of Project> --directory app
```

### Check the dependency graph

```bash
$ nx dep-graph
```

### Run an application

```bash
$ nx serve <name of the app>
# Example
$ nx serve client
```

### Run the app + microservices associated

```bash
$ nx run-many --parallel --target=serve --projects=client,microservice1,microservice2
```

### Running

For running the app, you need to first run the Nats server with the following command from the **Project** folder:

```bash
$ docker-compose up
```

Then you can run all the microservices + the client in one command:

```bash
$ nx run-many --parallel --target=serve --projects=client,microservice1,microservice2
```
