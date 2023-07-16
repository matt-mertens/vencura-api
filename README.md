# Vencua API

## Description

**Demo API:** https://vencura-api-production.up.railway.app/docs

**Demo APP:** https://vencura-lilac.vercel.app (https://github.com/matt-mertens/vencura)

## Installation

```bash
$ yarn install
```

## Env vars
```
PORT=
DYNAMIC_PUBLIC_KEY=
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Notes

### Architecture

#### Frontend
The implemented architecture is a simple react Single Page Application (SPA) utilizing Create React App and hosted statically on Vercel ([app](https://vencura-lilac.vercel.app)). This basic UI enables communcation with the Dynamic backend as well as the Vencura API. There are several areas of improvement to consider if this were to be integrated into a production setting. Adding in a comprehensive testing suite of unit, integration, and e2e testing would be required. Also, several areas of the UI require form / data validation to help safe guard intended usage. Things like balance checks before submitting a transaction, auto refreshing of activity history and balances, etc. should all be added to enhance the robustness of the application.

#### Backend
Apart from Dynamic's backend as an Authentication provider, the primary backend (vencura api) is a Node.js REST API built with the Nest.js framework. The nest.js framework utilizes espress.js under the hood but comes with a batteries included approach much like Django for python applications which makes it ideal for quick prototyping. The API implements Authentication on all the account endpoints by utilizing JWT tokens from Dynamic and validating them with the given public key. Once authenticated users can create, read, and delete wallets associated with their Dynamic user id. Additionally, authenticated users can sign messages as well as send transactions with any of their generated custodial wallets. Some improvements that can be made here would be more comprehensive tests for controllers, services, e2e, etc. as well as fixing some of the security flaws listed below. For a real production app the DB (SQLite) would also need to be swapped out for something more robust like postgreSQL or MySQL. More thorough implementation of object Types and data validation should also be added. Enabling various mainnet networks would also require abstracting out the Ethers providers to be able to support multi-network functionality. The current backend is hosted on Railway for quick prototyping but moving to a production senario running the app as a containerized workload on Kubernetes, AWS ECS, etc. would be more suitable

### Security
A major flaw in the current implementation is the private keys for each wallet are being stored in the SQLite DB unecrypted. In a production senario these keys would need to be stored encrypted. A user password or key could be implemented to encrypt the private keys with a salted one way hash algorithm for more security. Additionally, the current approach only stores the private key of the newly generated EOA account; a further improvement could be to store the mnemonic phrase for each user / tenant of the application so that new EOA's could be generated from the same seed. Additional considerations for restricting CORS, adding in ratelimiting, utilizing packages like Helmet to secure request and response headers, WAF, etc. should all also be implemented