# Description

This is a project done as an backend assessment for [QuestionPro](https://www.questionpro.com/)

### Functional Requirements

1. Develop an API that returns all the Employee Information under any given position in the organogram.
2. Call another API (Can be another endpoint of your current api) with JWT token authorization.
3. Create a nice Bootstrap UI to show the result.

### Non-functional Requirements

1. High Availability
2. API can support 5000 calls at the same time.

### Tech Stack

**Backend**: NestJS

**Database**: PostgreSQL

**Auth**: JWT

**Frontend**: Bootstrap, HTML, JS

**Other**: Docker

# Project setup

## Connect Database

For this project, I have opted to use Docker PostgreSQL image. First run your docker then in the bash:

```bash
docker run --name questionpro-pg-db -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=supersecret -e POSTGRES_DB=questionpro -p 5432:5432 -d postgres
```

## Install dependencies

```bash
npm install
```

## Environment Variables

Create a .env file in the root of the project and paste this:

```bash
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=supersecret
DB_NAME=questionpro
DB_DIALECT=postgres
PORT=8001

JWT_SECRET=zaq1!QAZ
```

## Build and run the seeder

```bash
# build
npm run build
```
```bash
# seeder
node dist/src/seeder.js
```

## Compile and run the project

```bash
# watch mode
npm run start:dev
```

## Run the client

I have used nestJS to serve a static UI. For UI I have used basic HTML, Bootstrap CSS and Javascript. Go to your browser and type:

```bash
http://localhost:8001
```

### UI Preview

![Organogram Viewer](https://github.com/user-attachments/assets/6dcacf37-0181-435e-9a64-049a36eb9105)

# Data Model

There are three tables in this project:

1. **employees** table contains employee information
2. **roles** table table contains role information along with the role heirarchy
3. **employee_roles** table contains relation between employee and role and this is a SCD Type 2 structure

![questionpro - public](https://github.com/user-attachments/assets/f5150b97-78c8-49e6-bff1-b070d91adf2d)

# API Design & Documentation
There is a single API requirement: to return all employee information under a specified position.

When the client sends a request to GET api/employee/:role_id, the following flow occurs:

1. The request hits the **NestJS backend server**.
2. The backend generates a **JWT token**, embedding the ```role_id``` as the payload.
3. It then makes an internal call to GET ```api/role```, attaching the generated token in the **Authorization header** as a Bearer token.
4. The ```/api/role``` endpoint validates the JWT and returns the list of subordinate roles under the given ```role_id```.

This flow is designed to simulate an **authorized request to a third-party API**, where authorization is handled via JWT.

![questionpro-api-design](https://github.com/user-attachments/assets/f11fc22d-8cc9-43cf-b383-eb228f6eed0e)

Postman Collection: https://fahimhasnat.postman.co/workspace/Fahim-Hasnat's-Workspace~4410836c-3590-44e6-8ccb-9631d42b546a/collection/45033274-678fff5a-671b-432f-8a8c-f6d4d6bb15c4?action=share&creator=45033274

# Logging

For logging I have leveraged the power of nestJS inceptor decorator. 
```js
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const startTime = Date.now();

    const logStart = {
      event: 'request',
      method,
      url,
      timestamp: new Date(startTime).toISOString(),
    };
    console.log(JSON.stringify(logStart));

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const logEnd = {
          event: 'response',
          method,
          url,
          executionTime: `${endTime - startTime}ms`,
          timestamp: new Date(endTime).toISOString(),
        };
        console.log(JSON.stringify(logEnd));
      }),
    );
  }
}

```
Output:
```
{"event":"request","method":"GET","url":"/employee/f7361c70-cb16-4ded-935a-be55ba1e31ed","timestamp":"2025-05-18T12:28:23.632Z"}
{"event":"request","method":"GET","url":"/role/subroles","timestamp":"2025-05-18T12:28:23.645Z"}
{"event":"response","method":"GET","url":"/role/subroles","executionTime":"7ms","timestamp":"2025-05-18T12:28:23.652Z"}
{"event":"response","method":"GET","url":"/employee/f7361c70-cb16-4ded-935a-be55ba1e31ed","executionTime":"34ms","timestamp":"2025-05-18T12:28:23.666Z"}
{"event":"request","method":"GET","url":"/employee/f7361c70-cb16-4ded-935a-be55ba1e31ed","timestamp":"2025-05-18T13:37:01.553Z"}
{"event":"request","method":"GET","url":"/role/subroles","timestamp":"2025-05-18T13:37:01.606Z"}
```

# Testing

The project uses Jest for both unit and integration testing. To run the test cases, ensure the server is running, then open a separate terminal and execute the following commands:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

# Optimization

## Database Optimization

1. ***Materialized Views:*** Materialized views can be used to store the results of frequently executed queries, leading to faster data retrieval.
2. ***Indexing:*** Proper indexing of database tables can significantly improve query performance.
3. ***Partitioning:*** For very large tables, such as those storing data for a high number of employees, partitioning can improve query performance and manageability.
4. ***Read Replicas:*** In read-heavy systems, employing multiple read replicas can distribute the read load and enhance performance.

## Caching

* Utilizing Redis allows data to be stored closer to the user, reducing latency.
* A write-through Redis caching strategy ensures that both the cache and the database are updated simultaneously, maintaining data consistency.
* Alternatively, an LRU (Least Recently Used) caching policy can be implemented to cache frequently accessed data.  However, this approach requires a data invalidation strategy to ensure the cache remains consistent with the database.

## Load Balancing

* Distributing incoming traffic across multiple server instances ensures that no single server is overwhelmed, improving responsiveness and availability.
* Load balancing can be implemented using various algorithms, such as round-robin, least connections, or IP hashing, depending on the specific requirements of the application.
* In addition to distributing traffic, load balancers can also perform health checks on servers and automatically remove unhealthy ones from the pool, further enhancing reliability.

## Logging & Monitoring at Scale

* ***Use a Dedicated Logging Service:*** Deploy a separate microservice and database specifically for handling logs, ensuring isolation from core application databases.
* ***Implement Data Retention Policies:*** Configure the logging system to automatically purge old log data periodically, keeping storage usage optimized and manageable.
* ***Enable Horizontal Scalability:*** Design the logging infrastructure to scale horizontally by adding nodes as log volume grows, maintaining performance under load.
* ***Enforce Structured Logging:*** Standardize logs in a consistent, structured format (e.g., JSON). This enhances searchability, parsing, and integration with monitoring tools.
* ***Adopt Asynchronous Logging:*** Log entries should be sent to a message queue (e.g., Kafka, RabbitMQ, or AWS Kinesis) before being processed. This enables throttling, prevents backpressure, and decouples log ingestion from application performance.
* ***Partition Log and Metrics Storage:*** Distribute logs and metrics across multiple storage nodes or partitions to improve throughput, reliability, and fault tolerance.

# Deployment

* ***Cloud:*** AWS
* ***Compute:*** EKS (Elastic Kubernetes Service) for running Dockerized NestJS containers
* ***Database:*** Amazon RDS (PostgreSQL)
* ***Container Registry:*** Amazon ECR

Steps:
1. Connect Amazon RDS
2. Test
3. Build Docker image
4. Push to Amazon ECR
5. Deploy via Helm



