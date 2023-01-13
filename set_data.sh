#!/usr/bin/env zsh

mongosh --eval "db.regions.drop()" --quiet
mongoimport --jsonArray --db test --collection regions --file data/city.json

mongosh --eval "db.categories.drop()" --quiet
mongoimport --jsonArray --db test --collection categories --file data/category.json

mongosh --eval "db.users.drop()" --quiet
mongoimport --jsonArray --db test --collection users --file data/user.json

mongosh --eval "db.feeds.drop()" --quiet
mongoimport --jsonArray --db test --collection feeds --file data/feed.json

mongosh --eval "db.counters.drop()" --quiet
mongoimport --jsonArray --db test --collection counters --file data/counter.json

mongosh --eval "db.images.drop()" --quiet
mongoimport --jsonArray --db test --collection images --file data/image.json
