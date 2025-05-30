

## [0.3.1](https://github.com/h2oai/protoc-gen-grpc-gateway-es/compare/v0.3.0...v0.3.1) (2025-02-27)


### Bug Fixes

* false-warning when query-string is undefined ([2ebd23a](https://github.com/h2oai/protoc-gen-grpc-gateway-es/commit/2ebd23ac66e222fc658316f36495ee7bc58a2d8f))
* input message is mutated when path or body targets nested field ([308c8e1](https://github.com/h2oai/protoc-gen-grpc-gateway-es/commit/308c8e14d576d5effbf306487c0c771e12691bd7))

## [0.3.0](https://github.com/h2oai/protoc-gen-grpc-gateway-es/compare/v0.1.6...v0.3.0) (2024-12-04)


### Features

* add name-parsers automatically ([191139b](https://github.com/h2oai/protoc-gen-grpc-gateway-es/commit/191139b82e2f75164be0ac6f3b76c8c70381c586))
* add path pattern compiler and parser ([62e3778](https://github.com/h2oai/protoc-gen-grpc-gateway-es/commit/62e3778f2b39a6ee1e1dad7dbb5d258ff0bc77c2))
* generate external dependencies when needed ([7013e55](https://github.com/h2oai/protoc-gen-grpc-gateway-es/commit/7013e5579c4baaad8fa2db9cf4248670ee4beaa8))


### Bug Fixes

* build don't work ([3f91d3a](https://github.com/h2oai/protoc-gen-grpc-gateway-es/commit/3f91d3a30fd3bd13bb8b58a0ab1c953a4a11e846))
* does not support more than 2 levels of nesting ([e011889](https://github.com/h2oai/protoc-gen-grpc-gateway-es/commit/e011889e7fe22cc8e5a2e114324b1af1fdd06527))
* enums use FQN as name, which is invalid ([f71be81](https://github.com/h2oai/protoc-gen-grpc-gateway-es/commit/f71be81f7b885267df17048fc0b8b1dcf98687fa))
* failed to reference rpc input message types ([baf0085](https://github.com/h2oai/protoc-gen-grpc-gateway-es/commit/baf0085bc70fdd73c512a4006e7b2bfa9fff0370))
* nested enum names not prefixed ([b217092](https://github.com/h2oai/protoc-gen-grpc-gateway-es/commit/b21709294ff4f876db96de930195f333d737e062))
* nested messages wrongly named ([5518356](https://github.com/h2oai/protoc-gen-grpc-gateway-es/commit/55183560c72c60c8591e2eabec2a84f08486a3a8))

## [0.2.3](https://github.com/h2oai/protoc-gen-grpc-gateway-es/compare/v0.2.2...v0.2.3) (2024-10-18)


### Bug Fixes

* failed to reference rpc input message types ([ddb718f](https://github.com/h2oai/protoc-gen-grpc-gateway-es/commit/ddb718fc6500baf57b2bb97391db69e19df8d94a))

## [0.2.2](https://github.com/h2oai/protoc-gen-grpc-gateway-es/compare/v0.2.1...v0.2.2) (2024-10-17)


### Bug Fixes

* nested enum names not prefixed ([85592af](https://github.com/h2oai/protoc-gen-grpc-gateway-es/commit/85592afccbec64c906727a8531eafd92e70ef70f))

## [0.2.1](https://github.com/h2oai/protoc-gen-grpc-gateway-es/compare/v0.2.0...v0.2.1) (2024-10-17)


### Bug Fixes

* enums use FQN as name, which is invalid ([fec57a0](https://github.com/h2oai/protoc-gen-grpc-gateway-es/commit/fec57a09c4a5eebbf7dc1cf165f640b8c9728bdf))

## [0.2.0](https://github.com/h2oai/protoc-gen-grpc-gateway-es/compare/v0.1.6...v0.2.0) (2024-10-17)


### Features

* add path pattern compiler and parser ([04ff62c](https://github.com/h2oai/protoc-gen-grpc-gateway-es/commit/04ff62cfb44afa629562697149e28ecd8a72039f))

## [0.1.6](https://github.com/czabaj/protoc-gen-grpc-gateway-es/compare/v0.1.5...v0.1.6) (2023-12-19)


### Bug Fixes

* google.http.api option body not camel-cased ([70c56c3](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/70c56c30316d4064defffed9f69e6a757be359f4))

## [0.1.5](https://github.com/czabaj/protoc-gen-grpc-gateway-es/compare/v0.1.4...v0.1.5) (2023-12-14)

## [0.1.4](https://github.com/czabaj/protoc-gen-grpc-gateway-es/compare/v0.1.3...v0.1.4) (2023-12-12)


### Bug Fixes

* array not set as quer-string ([49e78a2](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/49e78a2a10b1b9caf5a4e04d5e348799751a7dcb))

## [0.1.3](https://github.com/czabaj/protoc-gen-grpc-gateway-es/compare/v0.1.2...v0.1.3) (2023-11-15)


### Bug Fixes

* `asBigIntString` does not accept `string` input ([f845b7d](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/f845b7d90407c9d162b9bae0b6a004b3a89f039f))

## [0.1.2](https://github.com/czabaj/protoc-gen-grpc-gateway-es/compare/v0.1.1...v0.1.2) (2023-11-08)


### Bug Fixes

* `bin` field in `package.json` must be an object ([b371522](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/b371522367d8a8c09cebe361597177c16a458e2d))

## [0.1.1](https://github.com/czabaj/protoc-gen-grpc-gateway-es/compare/v0.1.0...v0.1.1) (2023-11-08)


### Bug Fixes

* export binary for `npx` ([d96ab93](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/d96ab930caa21e91f211de96c80626c296420c8b))

## 0.1.0 (2023-11-08)


### Features

* add basic service generation ([0d917c9](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/0d917c901982cf985ecaeea27277a5a2fefb1fe4))
* add common "runtime.js" file ([94d9441](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/94d94412b33eeb11f01fa60db63b09d3edaabd53))
* add support for binary payload ([6f14403](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/6f1440390d38e260669bf7cb80fe0b4c0c5ab44e))
* build executable ([1a875b9](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/1a875b9dde6299f1a6d978b2e7acea8943186867))
* generate simple messages ([c11c383](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/c11c383110bc935e8132394e2d783935fedfaf2e))
* handle adjacent messages ([5186631](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/518663106bdf8cb2f82a02d473b272d73c2a1a18))
* handle big ints ([3fadd26](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/3fadd26982e65fdc894f8dd25e2c0746c5b44a64))
* handle well-known types ([fa23dd1](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/fa23dd1583d651b42a573b276da12bfcab44af2e))
* initial commit with basic test ([d4c1ae3](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/d4c1ae3289ea817a854802969bc02a6bce6ba93a))
* subtracts common prefix from enums ([cd62949](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/cd6294928b1e674b32a5ef98a57a98086157dd54))
* suport protobuf bytes ([6aeedbd](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/6aeedbd6fa3382db9b8f644497d7e0d04ed6b5b1))
* support all HTTP methods ([86c58ef](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/86c58ef60b78660cf0430532b3812b62cb380e2e))
* support nested path parameters ([17fb2e2](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/17fb2e2a63adc7351f8eedc9dfa561a98c672c31))
* support oneof ([22feddb](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/22feddbfe91c08bce2be4e6847aafa4ed0e77997))
* support openapiv2 options ([4291361](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/42913615cb2d2d607939c73cf23ed24f30b9b6bd))
* support path parameters ([c42ba8b](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/c42ba8b976bc2a56a3a68ee01381e0bac9ff1c83))
* support the `google.api.http.body` option ([748839b](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/748839b5ecef1dbef8dc82b6494693b6f8be3312))
* writable WKT can is nullable ([5ff00d5](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/5ff00d5e5a88a586fdff3db1216d05d8e6de7a8f))


### Bug Fixes

* `runtime.ts` lacks ignore pragmas ([a6614e6](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/a6614e6c92474557017f900e48b60d53678e7a02))
* FieldMask is serialized to @bufbuild/protobuf type ([80d4550](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/80d4550f35b2cf3c8962a71fa8091f98c7589aae))
* handler non-http-option schemas ([f8601ec](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/f8601ecee479e704d37530ff92b4e89dbb03f702))
* pathname of basePath is ignored ([fea5c6e](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/fea5c6ed1a03d5c45962b0e97479596ed6dfe1ac))
* repeated WKTs are generated as non-repeated ([97ad9f6](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/97ad9f6c8b7b720d15fc32234cbacf4d40d54271))


### Performance Improvements

* speed up the test a little bit ([e79447f](https://github.com/czabaj/protoc-gen-grpc-gateway-es/commit/e79447f64563ede84e90c117d6380f3e107020d8))
