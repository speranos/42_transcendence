#!/bin/sh

npx prisma generate
npx prisma migrate dev --name toto_db
#npm run build
#npx prisma studio
#npm start dev
exec "$@"