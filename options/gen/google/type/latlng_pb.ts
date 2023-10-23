// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file google/type/latlng.proto (package google.type, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * An object that represents a latitude/longitude pair. This is expressed as a
 * pair of doubles to represent degrees latitude and degrees longitude. Unless
 * specified otherwise, this must conform to the
 * <a href="http://www.unoosa.org/pdf/icg/2012/template/WGS_84.pdf">WGS84
 * standard</a>. Values must be within normalized ranges.
 *
 * @generated from message google.type.LatLng
 */
export class LatLng extends Message<LatLng> {
  /**
   * The latitude in degrees. It must be in the range [-90.0, +90.0].
   *
   * @generated from field: double latitude = 1;
   */
  latitude = 0;

  /**
   * The longitude in degrees. It must be in the range [-180.0, +180.0].
   *
   * @generated from field: double longitude = 2;
   */
  longitude = 0;

  constructor(data?: PartialMessage<LatLng>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "google.type.LatLng";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "latitude", kind: "scalar", T: 1 /* ScalarType.DOUBLE */ },
    { no: 2, name: "longitude", kind: "scalar", T: 1 /* ScalarType.DOUBLE */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): LatLng {
    return new LatLng().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): LatLng {
    return new LatLng().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): LatLng {
    return new LatLng().fromJsonString(jsonString, options);
  }

  static equals(a: LatLng | PlainMessage<LatLng> | undefined, b: LatLng | PlainMessage<LatLng> | undefined): boolean {
    return proto3.util.equals(LatLng, a, b);
  }
}

