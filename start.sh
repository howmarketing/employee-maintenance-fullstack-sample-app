#!/bin/bash

# Install dependencies
npm i --force
npm i --legacy-peer-deps
npm i -D jest @types/jest @testing-library/jest-dom ts-jest @testing-library/user-event jest-environment-jsdom @testing-library/react --force
npx prisma generate
cp ./prisma/dev.db /tmp/dev.db
npx prisma migrate dev
# npm i --force && npm i --legacy-peer-deps && npm i -D jest @types/jest @testing-library/jest-dom ts-jest @testing-library/user-event jest-environment-jsdom @testing-library/react --force && npx prisma generate && cp ./prisma/dev.db /tmp/dev.db && npx prisma migrate dev
# Build your project
npm run build

# Run tests
npm run test
