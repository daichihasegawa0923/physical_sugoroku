import {
  AttributeValue,
  AttributeValueUpdate,
  DynamoDB,
} from '@aws-sdk/client-dynamodb';
import DayjsExtends from 'src/shared/dayjs.extends';

interface PlaneObject {
  [name: string]: string | number;
}

interface KeyInput {
  id: string;
  subId?: string;
}

export default function repository(tableName: string) {
  async function upsert(keyInput: KeyInput, updateInput: any) {
    await db().updateItem({
      TableName: tableName,
      Key: mapKeyInput(keyInput),
      AttributeUpdates: mapUpdateInput({
        ...updateInput,
        expiredAt: DayjsExtends().add(1, 'day').unix(),
      }),
    });
  }

  async function find(keyInput: KeyInput) {
    const data = (
      await db().getItem({ TableName: tableName, Key: mapKeyInput(keyInput) })
    )?.Item;
    if (!data) return undefined;
    return mapObject(data);
  }

  async function remove(keyInput: KeyInput) {
    await db().deleteItem({
      TableName: tableName,
      Key: mapKeyInput(keyInput),
    });
  }

  async function list(keyInput: KeyInput, Limit?: number) {
    const data = (
      await db().query({
        TableName: tableName,
        KeyConditions: mapKeyQueryEqInput(keyInput),
        Limit,
      })
    )?.Items;
    return data.map((d) => mapObject(d)) as any[];
  }

  return {
    upsert,
    remove,
    find,
    list,
  };
}

function mapKeyInput(obj: KeyInput) {
  const entries = Object.entries(obj);
  const data: Record<string, AttributeValue> = {};
  entries.forEach((e) => {
    const key = e[0];
    const val = e[1];
    if (typeof val === 'string') {
      data[key] = { S: val };
    }
    if (typeof val === 'boolean') {
      data[key] = { BOOL: val };
    }
    if (typeof val === 'number') {
      data[key] = { N: val.toString() };
    }
  });
  return data;
}

function db() {
  if (process.env.IS_OFFLINE) {
    return new DynamoDB({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    });
  }
  return new DynamoDB();
}

function mapUpdateInput(obj: PlaneObject) {
  const entries = Object.entries(obj);
  const data: Record<string, AttributeValueUpdate> = {};
  entries.forEach((e) => {
    const key = e[0];
    const val = e[1];
    if (typeof val === 'string') {
      data[key] = { Value: { S: val } };
    }
    if (typeof val === 'boolean') {
      data[key] = { Value: { BOOL: val } };
    }
    if (typeof val === 'number') {
      data[key] = { Value: { N: val.toString() } };
    }
  });
  return data;
}

function mapObject(record: Record<string, AttributeValue>) {
  const obj: { [name: string]: any } = {};
  Object.entries(record).forEach((e) => {
    const key = e[0];
    const val = e[1];
    if (val.S) {
      obj[key] = val.S;
    }
    if (val.BOOL) {
      obj[key] = val.BOOL;
    }
    if (val.N) {
      obj[key] = Number(val.N);
    }
  });
  return obj;
}

function mapKeyQueryEqInput(obj: KeyInput) {
  const data = Object.entries(mapKeyInput(obj)).reduce((result, data) => {
    result[data[0]] = {
      ComparisonOperator: 'EQ',
      AttributeValueList: [data[1]],
    };
    return result;
  }, {});
  return data;
}
