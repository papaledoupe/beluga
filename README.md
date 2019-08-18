# Beluga 🐋

(Very) basic docker registry frontend using:

- [typescript](https://www.typescriptlang.org)
- [ant design](https://ant.design)
- [nextjs](https://nextjs.org)

## Run

To run in dev (requirements: node, npm, docker)
- run `./scripts/setup-registry` to get a local registry seeded with some images
- run `npm run dev` to start the app
- visit `http://localhost:3000` 

Production packaging has not been done yet.

## To do

- Production image + environment configuration
- Delete images / layers
- Authentication, users, RBAC
- Index to secondary data store for more powerful search (registry API very limited)
- API test coverage
