# URL Shortening Service
Sample for [URL Shortening Service](https://roadmap.sh/projects/url-shortening-service) project on [roadmap.sh](https://roadmap.sh/)

## Usage
.env file is intentionally left. You can create your own db user if you wish.

run:
```bash
npm i
```
and then:
```bash
node index.js
```

When the app is up and running you can use the following endpoints like this:
Create new shortened url:
```bash
    curl --location 'localhost:3000/shorten' \
    --header 'Content-Type: application/json' \
    --data '{
        "url": "https://github.com/LoLoCrO/url-shortening-service"
    }'
```
resopnse:
```json
{
    "id": 16,
    "url": "https://github.com/LoLoCrO/url-shortening-service",
    "short_code": "BqIyCc",
    "access_count": 0,
    "created_at": "2024-12-26T18:17:04.398Z",
    "updated_at": "2024-12-26T18:17:04.398Z"
}
```

Get the long url via `short_code`:
```bash
    curl --location 'localhost:3000/shorten/BqIyCc'
```
response:
```json
{
    "url": "https://github.com/LoLoCrO/url-shortening-service"
}
```

Update an existing url via `short_code`:
```bash
    curl --location --request PUT 'localhost:3000/shorten/BqIyCc' \
    --header 'Content-Type: application/json' \
    --data '{
        "url": "http://github.com/LoLoCrO/url-shortening-service"
    }'
```
response:
```json
{
    "id": 16,
    "url": "http://github.com/LoLoCrO/url-shortening-service",
    "short_code": "BqIyCc",
    "access_count": 0,
    "created_at": "2024-12-26T18:17:04.398Z",
    "updated_at": "2024-12-26T18:20:15.408Z"
}
```

Get access count via `short_code`:
```bash
    curl --location --request GET 'localhost:3000/shorten/BqIyCc/stat' \
    --header 'Content-Type: application/json' \
    --data '{
        "url": "http://github.com/LoLoCrO/url-shortening-service"
    }'
```
response:
```json
{
    "access_count": 2
}
```

Delete url via `short_code`:
```bash
    curl --location --request DELETE 'localhost:3000/shorten/BqIyCc'
```
response:
```json
{
    "id": 16,
    "url": "http://github.com/LoLoCrO/url-shortening-service",
    "short_code": "BqIyCc",
    "access_count": 2,
    "created_at": "2024-12-26T18:17:04.398Z",
    "updated_at": "2024-12-26T18:20:15.408Z"
}
```
