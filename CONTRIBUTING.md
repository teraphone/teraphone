# Contributing

## OpenAPI

### Convert Postman collection to OpenAPI

```sh
# Export api.teraphone.app.postman_collection.json from Postman to src/renderer/store
(cd cd src/renderer/store && npm exec --package postman-to-openapi -- p2o ./api.teraphone.app.postman_collection.json -f api.teraphone.app.yml)
```

### View docs with Redoc

```sh
# Update command to your your repo location instead of ~/src/teraphone
echo 'Serving ReDoc at http://localhost:8080' && docker run -it --rm -p 8080:80 -v ~/src/teraphone/src/renderer/store/api.teraphone.app.yml:/usr/share/nginx/html/api.teraphone.app.yml -e SPEC_URL=api.teraphone.app.yml redocly/redoc
```

### Mock server with APISprout

```sh
# Update command to your your repo location instead of ~/src/teraphone
echo 'Serving APISprout at http://localhost:8000' && docker run -p 8000:8000 -v ~/src/teraphone/src/renderer/store/api.teraphone.app.yml:/api.teraphone.app.yml danielgtaylor/apisprout /api.teraphone.app.yml
```

### Generate RTK Query from OpenAPI

```sh
(cd src/renderer/store && npm exec @rtk-query/codegen-openapi openapi-config.ts)
```

That command outputs RTK Query definitions based on the OpenApi spec at `src/renderer/store/peachone.ts`, after which RTK query hooks can be used as well as all the other features (caching, polling, lifecycle flags, etc.), e.g. something along the lines of:

```ts
const { data, status, error, refetch, isUninitialized, isLoading, isFetching } =
  useGetV1PrivateWorldQuery({
    pollingInterval: 10000,
  });
```
