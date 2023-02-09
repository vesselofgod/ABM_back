
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

mongosh --eval "db.matches.drop()" --quiet
mongoimport --jsonArray --db test --collection matches --file data/match.json

mongosh --eval "db.scraps.drop()" --quiet
mongoimport --jsonArray --db test --collection scraps --file data/scrap.json

mongosh --eval "db.devices.drop()" --quiet
mongoimport --jsonArray --db test --collection devices --file data/device.json

mongosh --eval "db.notices.drop()" --quiet
mongoimport --jsonArray --db test --collection notices --file data/notice.json

mongosh --eval "db.rooms.drop()" --quiet
mongoimport --jsonArray --db test --collection rooms --file data/room.json

mongosh --eval "db.messages.drop()" --quiet
mongoimport --jsonArray --db test --collection messages --file data/message.json