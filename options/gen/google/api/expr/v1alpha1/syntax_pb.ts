// Copyright 2022 Google LLC
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
// @generated from file google/api/expr/v1alpha1/syntax.proto (package google.api.expr.v1alpha1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Duration, Message, NullValue, proto3, protoInt64, Timestamp } from "@bufbuild/protobuf";

/**
 * An expression together with source information as returned by the parser.
 *
 * @generated from message google.api.expr.v1alpha1.ParsedExpr
 */
export class ParsedExpr extends Message<ParsedExpr> {
  /**
   * The parsed expression.
   *
   * @generated from field: google.api.expr.v1alpha1.Expr expr = 2;
   */
  expr?: Expr;

  /**
   * The source info derived from input that generated the parsed `expr`.
   *
   * @generated from field: google.api.expr.v1alpha1.SourceInfo source_info = 3;
   */
  sourceInfo?: SourceInfo;

  constructor(data?: PartialMessage<ParsedExpr>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "google.api.expr.v1alpha1.ParsedExpr";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 2, name: "expr", kind: "message", T: Expr },
    { no: 3, name: "source_info", kind: "message", T: SourceInfo },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ParsedExpr {
    return new ParsedExpr().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ParsedExpr {
    return new ParsedExpr().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ParsedExpr {
    return new ParsedExpr().fromJsonString(jsonString, options);
  }

  static equals(a: ParsedExpr | PlainMessage<ParsedExpr> | undefined, b: ParsedExpr | PlainMessage<ParsedExpr> | undefined): boolean {
    return proto3.util.equals(ParsedExpr, a, b);
  }
}

/**
 * An abstract representation of a common expression.
 *
 * Expressions are abstractly represented as a collection of identifiers,
 * select statements, function calls, literals, and comprehensions. All
 * operators with the exception of the '.' operator are modelled as function
 * calls. This makes it easy to represent new operators into the existing AST.
 *
 * All references within expressions must resolve to a [Decl][google.api.expr.v1alpha1.Decl] provided at
 * type-check for an expression to be valid. A reference may either be a bare
 * identifier `name` or a qualified identifier `google.api.name`. References
 * may either refer to a value or a function declaration.
 *
 * For example, the expression `google.api.name.startsWith('expr')` references
 * the declaration `google.api.name` within a [Expr.Select][google.api.expr.v1alpha1.Expr.Select] expression, and
 * the function declaration `startsWith`.
 *
 * @generated from message google.api.expr.v1alpha1.Expr
 */
export class Expr extends Message<Expr> {
  /**
   * Required. An id assigned to this node by the parser which is unique in a
   * given expression tree. This is used to associate type information and other
   * attributes to a node in the parse tree.
   *
   * @generated from field: int64 id = 2;
   */
  id = protoInt64.zero;

  /**
   * Required. Variants of expressions.
   *
   * @generated from oneof google.api.expr.v1alpha1.Expr.expr_kind
   */
  exprKind: {
    /**
     * A literal expression.
     *
     * @generated from field: google.api.expr.v1alpha1.Constant const_expr = 3;
     */
    value: Constant;
    case: "constExpr";
  } | {
    /**
     * An identifier expression.
     *
     * @generated from field: google.api.expr.v1alpha1.Expr.Ident ident_expr = 4;
     */
    value: Expr_Ident;
    case: "identExpr";
  } | {
    /**
     * A field selection expression, e.g. `request.auth`.
     *
     * @generated from field: google.api.expr.v1alpha1.Expr.Select select_expr = 5;
     */
    value: Expr_Select;
    case: "selectExpr";
  } | {
    /**
     * A call expression, including calls to predefined functions and operators.
     *
     * @generated from field: google.api.expr.v1alpha1.Expr.Call call_expr = 6;
     */
    value: Expr_Call;
    case: "callExpr";
  } | {
    /**
     * A list creation expression.
     *
     * @generated from field: google.api.expr.v1alpha1.Expr.CreateList list_expr = 7;
     */
    value: Expr_CreateList;
    case: "listExpr";
  } | {
    /**
     * A map or message creation expression.
     *
     * @generated from field: google.api.expr.v1alpha1.Expr.CreateStruct struct_expr = 8;
     */
    value: Expr_CreateStruct;
    case: "structExpr";
  } | {
    /**
     * A comprehension expression.
     *
     * @generated from field: google.api.expr.v1alpha1.Expr.Comprehension comprehension_expr = 9;
     */
    value: Expr_Comprehension;
    case: "comprehensionExpr";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<Expr>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "google.api.expr.v1alpha1.Expr";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 2, name: "id", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 3, name: "const_expr", kind: "message", T: Constant, oneof: "expr_kind" },
    { no: 4, name: "ident_expr", kind: "message", T: Expr_Ident, oneof: "expr_kind" },
    { no: 5, name: "select_expr", kind: "message", T: Expr_Select, oneof: "expr_kind" },
    { no: 6, name: "call_expr", kind: "message", T: Expr_Call, oneof: "expr_kind" },
    { no: 7, name: "list_expr", kind: "message", T: Expr_CreateList, oneof: "expr_kind" },
    { no: 8, name: "struct_expr", kind: "message", T: Expr_CreateStruct, oneof: "expr_kind" },
    { no: 9, name: "comprehension_expr", kind: "message", T: Expr_Comprehension, oneof: "expr_kind" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Expr {
    return new Expr().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Expr {
    return new Expr().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Expr {
    return new Expr().fromJsonString(jsonString, options);
  }

  static equals(a: Expr | PlainMessage<Expr> | undefined, b: Expr | PlainMessage<Expr> | undefined): boolean {
    return proto3.util.equals(Expr, a, b);
  }
}

/**
 * An identifier expression. e.g. `request`.
 *
 * @generated from message google.api.expr.v1alpha1.Expr.Ident
 */
export class Expr_Ident extends Message<Expr_Ident> {
  /**
   * Required. Holds a single, unqualified identifier, possibly preceded by a
   * '.'.
   *
   * Qualified names are represented by the [Expr.Select][google.api.expr.v1alpha1.Expr.Select] expression.
   *
   * @generated from field: string name = 1;
   */
  name = "";

  constructor(data?: PartialMessage<Expr_Ident>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "google.api.expr.v1alpha1.Expr.Ident";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Expr_Ident {
    return new Expr_Ident().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Expr_Ident {
    return new Expr_Ident().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Expr_Ident {
    return new Expr_Ident().fromJsonString(jsonString, options);
  }

  static equals(a: Expr_Ident | PlainMessage<Expr_Ident> | undefined, b: Expr_Ident | PlainMessage<Expr_Ident> | undefined): boolean {
    return proto3.util.equals(Expr_Ident, a, b);
  }
}

/**
 * A field selection expression. e.g. `request.auth`.
 *
 * @generated from message google.api.expr.v1alpha1.Expr.Select
 */
export class Expr_Select extends Message<Expr_Select> {
  /**
   * Required. The target of the selection expression.
   *
   * For example, in the select expression `request.auth`, the `request`
   * portion of the expression is the `operand`.
   *
   * @generated from field: google.api.expr.v1alpha1.Expr operand = 1;
   */
  operand?: Expr;

  /**
   * Required. The name of the field to select.
   *
   * For example, in the select expression `request.auth`, the `auth` portion
   * of the expression would be the `field`.
   *
   * @generated from field: string field = 2;
   */
  field = "";

  /**
   * Whether the select is to be interpreted as a field presence test.
   *
   * This results from the macro `has(request.auth)`.
   *
   * @generated from field: bool test_only = 3;
   */
  testOnly = false;

  constructor(data?: PartialMessage<Expr_Select>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "google.api.expr.v1alpha1.Expr.Select";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "operand", kind: "message", T: Expr },
    { no: 2, name: "field", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "test_only", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Expr_Select {
    return new Expr_Select().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Expr_Select {
    return new Expr_Select().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Expr_Select {
    return new Expr_Select().fromJsonString(jsonString, options);
  }

  static equals(a: Expr_Select | PlainMessage<Expr_Select> | undefined, b: Expr_Select | PlainMessage<Expr_Select> | undefined): boolean {
    return proto3.util.equals(Expr_Select, a, b);
  }
}

/**
 * A call expression, including calls to predefined functions and operators.
 *
 * For example, `value == 10`, `size(map_value)`.
 *
 * @generated from message google.api.expr.v1alpha1.Expr.Call
 */
export class Expr_Call extends Message<Expr_Call> {
  /**
   * The target of an method call-style expression. For example, `x` in
   * `x.f()`.
   *
   * @generated from field: google.api.expr.v1alpha1.Expr target = 1;
   */
  target?: Expr;

  /**
   * Required. The name of the function or method being called.
   *
   * @generated from field: string function = 2;
   */
  function = "";

  /**
   * The arguments.
   *
   * @generated from field: repeated google.api.expr.v1alpha1.Expr args = 3;
   */
  args: Expr[] = [];

  constructor(data?: PartialMessage<Expr_Call>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "google.api.expr.v1alpha1.Expr.Call";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "target", kind: "message", T: Expr },
    { no: 2, name: "function", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "args", kind: "message", T: Expr, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Expr_Call {
    return new Expr_Call().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Expr_Call {
    return new Expr_Call().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Expr_Call {
    return new Expr_Call().fromJsonString(jsonString, options);
  }

  static equals(a: Expr_Call | PlainMessage<Expr_Call> | undefined, b: Expr_Call | PlainMessage<Expr_Call> | undefined): boolean {
    return proto3.util.equals(Expr_Call, a, b);
  }
}

/**
 * A list creation expression.
 *
 * Lists may either be homogenous, e.g. `[1, 2, 3]`, or heterogeneous, e.g.
 * `dyn([1, 'hello', 2.0])`
 *
 * @generated from message google.api.expr.v1alpha1.Expr.CreateList
 */
export class Expr_CreateList extends Message<Expr_CreateList> {
  /**
   * The elements part of the list.
   *
   * @generated from field: repeated google.api.expr.v1alpha1.Expr elements = 1;
   */
  elements: Expr[] = [];

  /**
   * The indices within the elements list which are marked as optional
   * elements.
   *
   * When an optional-typed value is present, the value it contains
   * is included in the list. If the optional-typed value is absent, the list
   * element is omitted from the CreateList result.
   *
   * @generated from field: repeated int32 optional_indices = 2;
   */
  optionalIndices: number[] = [];

  constructor(data?: PartialMessage<Expr_CreateList>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "google.api.expr.v1alpha1.Expr.CreateList";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "elements", kind: "message", T: Expr, repeated: true },
    { no: 2, name: "optional_indices", kind: "scalar", T: 5 /* ScalarType.INT32 */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Expr_CreateList {
    return new Expr_CreateList().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Expr_CreateList {
    return new Expr_CreateList().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Expr_CreateList {
    return new Expr_CreateList().fromJsonString(jsonString, options);
  }

  static equals(a: Expr_CreateList | PlainMessage<Expr_CreateList> | undefined, b: Expr_CreateList | PlainMessage<Expr_CreateList> | undefined): boolean {
    return proto3.util.equals(Expr_CreateList, a, b);
  }
}

/**
 * A map or message creation expression.
 *
 * Maps are constructed as `{'key_name': 'value'}`. Message construction is
 * similar, but prefixed with a type name and composed of field ids:
 * `types.MyType{field_id: 'value'}`.
 *
 * @generated from message google.api.expr.v1alpha1.Expr.CreateStruct
 */
export class Expr_CreateStruct extends Message<Expr_CreateStruct> {
  /**
   * The type name of the message to be created, empty when creating map
   * literals.
   *
   * @generated from field: string message_name = 1;
   */
  messageName = "";

  /**
   * The entries in the creation expression.
   *
   * @generated from field: repeated google.api.expr.v1alpha1.Expr.CreateStruct.Entry entries = 2;
   */
  entries: Expr_CreateStruct_Entry[] = [];

  constructor(data?: PartialMessage<Expr_CreateStruct>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "google.api.expr.v1alpha1.Expr.CreateStruct";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "message_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "entries", kind: "message", T: Expr_CreateStruct_Entry, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Expr_CreateStruct {
    return new Expr_CreateStruct().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Expr_CreateStruct {
    return new Expr_CreateStruct().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Expr_CreateStruct {
    return new Expr_CreateStruct().fromJsonString(jsonString, options);
  }

  static equals(a: Expr_CreateStruct | PlainMessage<Expr_CreateStruct> | undefined, b: Expr_CreateStruct | PlainMessage<Expr_CreateStruct> | undefined): boolean {
    return proto3.util.equals(Expr_CreateStruct, a, b);
  }
}

/**
 * Represents an entry.
 *
 * @generated from message google.api.expr.v1alpha1.Expr.CreateStruct.Entry
 */
export class Expr_CreateStruct_Entry extends Message<Expr_CreateStruct_Entry> {
  /**
   * Required. An id assigned to this node by the parser which is unique
   * in a given expression tree. This is used to associate type
   * information and other attributes to the node.
   *
   * @generated from field: int64 id = 1;
   */
  id = protoInt64.zero;

  /**
   * The `Entry` key kinds.
   *
   * @generated from oneof google.api.expr.v1alpha1.Expr.CreateStruct.Entry.key_kind
   */
  keyKind: {
    /**
     * The field key for a message creator statement.
     *
     * @generated from field: string field_key = 2;
     */
    value: string;
    case: "fieldKey";
  } | {
    /**
     * The key expression for a map creation statement.
     *
     * @generated from field: google.api.expr.v1alpha1.Expr map_key = 3;
     */
    value: Expr;
    case: "mapKey";
  } | { case: undefined; value?: undefined } = { case: undefined };

  /**
   * Required. The value assigned to the key.
   *
   * If the optional_entry field is true, the expression must resolve to an
   * optional-typed value. If the optional value is present, the key will be
   * set; however, if the optional value is absent, the key will be unset.
   *
   * @generated from field: google.api.expr.v1alpha1.Expr value = 4;
   */
  value?: Expr;

  /**
   * Whether the key-value pair is optional.
   *
   * @generated from field: bool optional_entry = 5;
   */
  optionalEntry = false;

  constructor(data?: PartialMessage<Expr_CreateStruct_Entry>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "google.api.expr.v1alpha1.Expr.CreateStruct.Entry";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 2, name: "field_key", kind: "scalar", T: 9 /* ScalarType.STRING */, oneof: "key_kind" },
    { no: 3, name: "map_key", kind: "message", T: Expr, oneof: "key_kind" },
    { no: 4, name: "value", kind: "message", T: Expr },
    { no: 5, name: "optional_entry", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Expr_CreateStruct_Entry {
    return new Expr_CreateStruct_Entry().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Expr_CreateStruct_Entry {
    return new Expr_CreateStruct_Entry().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Expr_CreateStruct_Entry {
    return new Expr_CreateStruct_Entry().fromJsonString(jsonString, options);
  }

  static equals(a: Expr_CreateStruct_Entry | PlainMessage<Expr_CreateStruct_Entry> | undefined, b: Expr_CreateStruct_Entry | PlainMessage<Expr_CreateStruct_Entry> | undefined): boolean {
    return proto3.util.equals(Expr_CreateStruct_Entry, a, b);
  }
}

/**
 * A comprehension expression applied to a list or map.
 *
 * Comprehensions are not part of the core syntax, but enabled with macros.
 * A macro matches a specific call signature within a parsed AST and replaces
 * the call with an alternate AST block. Macro expansion happens at parse
 * time.
 *
 * The following macros are supported within CEL:
 *
 * Aggregate type macros may be applied to all elements in a list or all keys
 * in a map:
 *
 * *  `all`, `exists`, `exists_one` -  test a predicate expression against
 *    the inputs and return `true` if the predicate is satisfied for all,
 *    any, or only one value `list.all(x, x < 10)`.
 * *  `filter` - test a predicate expression against the inputs and return
 *    the subset of elements which satisfy the predicate:
 *    `payments.filter(p, p > 1000)`.
 * *  `map` - apply an expression to all elements in the input and return the
 *    output aggregate type: `[1, 2, 3].map(i, i * i)`.
 *
 * The `has(m.x)` macro tests whether the property `x` is present in struct
 * `m`. The semantics of this macro depend on the type of `m`. For proto2
 * messages `has(m.x)` is defined as 'defined, but not set`. For proto3, the
 * macro tests whether the property is set to its default. For map and struct
 * types, the macro tests whether the property `x` is defined on `m`.
 *
 * @generated from message google.api.expr.v1alpha1.Expr.Comprehension
 */
export class Expr_Comprehension extends Message<Expr_Comprehension> {
  /**
   * The name of the iteration variable.
   *
   * @generated from field: string iter_var = 1;
   */
  iterVar = "";

  /**
   * The range over which var iterates.
   *
   * @generated from field: google.api.expr.v1alpha1.Expr iter_range = 2;
   */
  iterRange?: Expr;

  /**
   * The name of the variable used for accumulation of the result.
   *
   * @generated from field: string accu_var = 3;
   */
  accuVar = "";

  /**
   * The initial value of the accumulator.
   *
   * @generated from field: google.api.expr.v1alpha1.Expr accu_init = 4;
   */
  accuInit?: Expr;

  /**
   * An expression which can contain iter_var and accu_var.
   *
   * Returns false when the result has been computed and may be used as
   * a hint to short-circuit the remainder of the comprehension.
   *
   * @generated from field: google.api.expr.v1alpha1.Expr loop_condition = 5;
   */
  loopCondition?: Expr;

  /**
   * An expression which can contain iter_var and accu_var.
   *
   * Computes the next value of accu_var.
   *
   * @generated from field: google.api.expr.v1alpha1.Expr loop_step = 6;
   */
  loopStep?: Expr;

  /**
   * An expression which can contain accu_var.
   *
   * Computes the result.
   *
   * @generated from field: google.api.expr.v1alpha1.Expr result = 7;
   */
  result?: Expr;

  constructor(data?: PartialMessage<Expr_Comprehension>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "google.api.expr.v1alpha1.Expr.Comprehension";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "iter_var", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "iter_range", kind: "message", T: Expr },
    { no: 3, name: "accu_var", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "accu_init", kind: "message", T: Expr },
    { no: 5, name: "loop_condition", kind: "message", T: Expr },
    { no: 6, name: "loop_step", kind: "message", T: Expr },
    { no: 7, name: "result", kind: "message", T: Expr },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Expr_Comprehension {
    return new Expr_Comprehension().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Expr_Comprehension {
    return new Expr_Comprehension().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Expr_Comprehension {
    return new Expr_Comprehension().fromJsonString(jsonString, options);
  }

  static equals(a: Expr_Comprehension | PlainMessage<Expr_Comprehension> | undefined, b: Expr_Comprehension | PlainMessage<Expr_Comprehension> | undefined): boolean {
    return proto3.util.equals(Expr_Comprehension, a, b);
  }
}

/**
 * Represents a primitive literal.
 *
 * Named 'Constant' here for backwards compatibility.
 *
 * This is similar as the primitives supported in the well-known type
 * `google.protobuf.Value`, but richer so it can represent CEL's full range of
 * primitives.
 *
 * Lists and structs are not included as constants as these aggregate types may
 * contain [Expr][google.api.expr.v1alpha1.Expr] elements which require evaluation and are thus not constant.
 *
 * Examples of literals include: `"hello"`, `b'bytes'`, `1u`, `4.2`, `-2`,
 * `true`, `null`.
 *
 * @generated from message google.api.expr.v1alpha1.Constant
 */
export class Constant extends Message<Constant> {
  /**
   * Required. The valid constant kinds.
   *
   * @generated from oneof google.api.expr.v1alpha1.Constant.constant_kind
   */
  constantKind: {
    /**
     * null value.
     *
     * @generated from field: google.protobuf.NullValue null_value = 1;
     */
    value: NullValue;
    case: "nullValue";
  } | {
    /**
     * boolean value.
     *
     * @generated from field: bool bool_value = 2;
     */
    value: boolean;
    case: "boolValue";
  } | {
    /**
     * int64 value.
     *
     * @generated from field: int64 int64_value = 3;
     */
    value: bigint;
    case: "int64Value";
  } | {
    /**
     * uint64 value.
     *
     * @generated from field: uint64 uint64_value = 4;
     */
    value: bigint;
    case: "uint64Value";
  } | {
    /**
     * double value.
     *
     * @generated from field: double double_value = 5;
     */
    value: number;
    case: "doubleValue";
  } | {
    /**
     * string value.
     *
     * @generated from field: string string_value = 6;
     */
    value: string;
    case: "stringValue";
  } | {
    /**
     * bytes value.
     *
     * @generated from field: bytes bytes_value = 7;
     */
    value: Uint8Array;
    case: "bytesValue";
  } | {
    /**
     * protobuf.Duration value.
     *
     * Deprecated: duration is no longer considered a builtin cel type.
     *
     * @generated from field: google.protobuf.Duration duration_value = 8 [deprecated = true];
     * @deprecated
     */
    value: Duration;
    case: "durationValue";
  } | {
    /**
     * protobuf.Timestamp value.
     *
     * Deprecated: timestamp is no longer considered a builtin cel type.
     *
     * @generated from field: google.protobuf.Timestamp timestamp_value = 9 [deprecated = true];
     * @deprecated
     */
    value: Timestamp;
    case: "timestampValue";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<Constant>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "google.api.expr.v1alpha1.Constant";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "null_value", kind: "enum", T: proto3.getEnumType(NullValue), oneof: "constant_kind" },
    { no: 2, name: "bool_value", kind: "scalar", T: 8 /* ScalarType.BOOL */, oneof: "constant_kind" },
    { no: 3, name: "int64_value", kind: "scalar", T: 3 /* ScalarType.INT64 */, oneof: "constant_kind" },
    { no: 4, name: "uint64_value", kind: "scalar", T: 4 /* ScalarType.UINT64 */, oneof: "constant_kind" },
    { no: 5, name: "double_value", kind: "scalar", T: 1 /* ScalarType.DOUBLE */, oneof: "constant_kind" },
    { no: 6, name: "string_value", kind: "scalar", T: 9 /* ScalarType.STRING */, oneof: "constant_kind" },
    { no: 7, name: "bytes_value", kind: "scalar", T: 12 /* ScalarType.BYTES */, oneof: "constant_kind" },
    { no: 8, name: "duration_value", kind: "message", T: Duration, oneof: "constant_kind" },
    { no: 9, name: "timestamp_value", kind: "message", T: Timestamp, oneof: "constant_kind" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Constant {
    return new Constant().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Constant {
    return new Constant().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Constant {
    return new Constant().fromJsonString(jsonString, options);
  }

  static equals(a: Constant | PlainMessage<Constant> | undefined, b: Constant | PlainMessage<Constant> | undefined): boolean {
    return proto3.util.equals(Constant, a, b);
  }
}

/**
 * Source information collected at parse time.
 *
 * @generated from message google.api.expr.v1alpha1.SourceInfo
 */
export class SourceInfo extends Message<SourceInfo> {
  /**
   * The syntax version of the source, e.g. `cel1`.
   *
   * @generated from field: string syntax_version = 1;
   */
  syntaxVersion = "";

  /**
   * The location name. All position information attached to an expression is
   * relative to this location.
   *
   * The location could be a file, UI element, or similar. For example,
   * `acme/app/AnvilPolicy.cel`.
   *
   * @generated from field: string location = 2;
   */
  location = "";

  /**
   * Monotonically increasing list of code point offsets where newlines
   * `\n` appear.
   *
   * The line number of a given position is the index `i` where for a given
   * `id` the `line_offsets[i] < id_positions[id] < line_offsets[i+1]`. The
   * column may be derivd from `id_positions[id] - line_offsets[i]`.
   *
   * @generated from field: repeated int32 line_offsets = 3;
   */
  lineOffsets: number[] = [];

  /**
   * A map from the parse node id (e.g. `Expr.id`) to the code point offset
   * within the source.
   *
   * @generated from field: map<int64, int32> positions = 4;
   */
  positions: { [key: string]: number } = {};

  /**
   * A map from the parse node id where a macro replacement was made to the
   * call `Expr` that resulted in a macro expansion.
   *
   * For example, `has(value.field)` is a function call that is replaced by a
   * `test_only` field selection in the AST. Likewise, the call
   * `list.exists(e, e > 10)` translates to a comprehension expression. The key
   * in the map corresponds to the expression id of the expanded macro, and the
   * value is the call `Expr` that was replaced.
   *
   * @generated from field: map<int64, google.api.expr.v1alpha1.Expr> macro_calls = 5;
   */
  macroCalls: { [key: string]: Expr } = {};

  constructor(data?: PartialMessage<SourceInfo>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "google.api.expr.v1alpha1.SourceInfo";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "syntax_version", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "location", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "line_offsets", kind: "scalar", T: 5 /* ScalarType.INT32 */, repeated: true },
    { no: 4, name: "positions", kind: "map", K: 3 /* ScalarType.INT64 */, V: {kind: "scalar", T: 5 /* ScalarType.INT32 */} },
    { no: 5, name: "macro_calls", kind: "map", K: 3 /* ScalarType.INT64 */, V: {kind: "message", T: Expr} },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SourceInfo {
    return new SourceInfo().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SourceInfo {
    return new SourceInfo().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SourceInfo {
    return new SourceInfo().fromJsonString(jsonString, options);
  }

  static equals(a: SourceInfo | PlainMessage<SourceInfo> | undefined, b: SourceInfo | PlainMessage<SourceInfo> | undefined): boolean {
    return proto3.util.equals(SourceInfo, a, b);
  }
}

/**
 * A specific position in source.
 *
 * @generated from message google.api.expr.v1alpha1.SourcePosition
 */
export class SourcePosition extends Message<SourcePosition> {
  /**
   * The soucre location name (e.g. file name).
   *
   * @generated from field: string location = 1;
   */
  location = "";

  /**
   * The UTF-8 code unit offset.
   *
   * @generated from field: int32 offset = 2;
   */
  offset = 0;

  /**
   * The 1-based index of the starting line in the source text
   * where the issue occurs, or 0 if unknown.
   *
   * @generated from field: int32 line = 3;
   */
  line = 0;

  /**
   * The 0-based index of the starting position within the line of source text
   * where the issue occurs.  Only meaningful if line is nonzero.
   *
   * @generated from field: int32 column = 4;
   */
  column = 0;

  constructor(data?: PartialMessage<SourcePosition>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "google.api.expr.v1alpha1.SourcePosition";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "location", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "offset", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "line", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 4, name: "column", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SourcePosition {
    return new SourcePosition().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SourcePosition {
    return new SourcePosition().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SourcePosition {
    return new SourcePosition().fromJsonString(jsonString, options);
  }

  static equals(a: SourcePosition | PlainMessage<SourcePosition> | undefined, b: SourcePosition | PlainMessage<SourcePosition> | undefined): boolean {
    return proto3.util.equals(SourcePosition, a, b);
  }
}

