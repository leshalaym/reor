import {
  Schema,
  Field,
  Utf8,
  FixedSizeList,
  Float32,
  Float64,
  DateUnit,
  Date_ as ArrowDate,
} from "apache-arrow";

export interface DBEntry {
  notepath: string;
  vector?: Float32Array;
  content: string;
  subnoteindex: number;
  timeadded: Date;
  filemodified: Date;
}
export interface DBQueryResult extends DBEntry {
  _distance: number;
}

export enum DatabaseFields {
  NOTE_PATH = "notepath",
  VECTOR = "vector",
  CONTENT = "content",
  SUB_NOTE_INDEX = "subnoteindex",
  TIME_ADDED = "timeadded",
  FILE_MODIFIED = "filemodified",
  DISTANCE = "_distance",
}

const CreateDatabaseSchema = (vectorDim: number): Schema => {
  const schemaFields = [
    new Field(DatabaseFields.NOTE_PATH, new Utf8(), false),
    new Field(
      DatabaseFields.VECTOR,
      new FixedSizeList(vectorDim, new Field("item", new Float32())),
      false
    ),
    new Field(DatabaseFields.CONTENT, new Utf8(), false),
    new Field(DatabaseFields.SUB_NOTE_INDEX, new Float64(), false),
    new Field(
      DatabaseFields.TIME_ADDED,
      new ArrowDate(DateUnit.MILLISECOND),
      false
    ),
    new Field(
      DatabaseFields.FILE_MODIFIED,
      new ArrowDate(DateUnit.MILLISECOND),
      false
    ),
  ];
  const schema = new Schema(schemaFields);
  return schema;
};

const serializeSchema = (schema: Schema): string => {
  return JSON.stringify(
    schema.fields.map((field) => ({
      name: field.name,
      type: field.type.toString(),
      nullable: field.nullable,
    }))
  );
};

export const isStringifiedSchemaEqual = (
  schema1: Schema,
  schema2: Schema
): boolean => {
  const serializedSchema1 = serializeSchema(schema1);
  const serializedSchema2 = serializeSchema(schema2);

  return serializedSchema1 === serializedSchema2;
};
export default CreateDatabaseSchema;
