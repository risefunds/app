import {
  models,
  IReferenceDB,
  IWhereParam,
  getSDKServices,
} from '@risefunds/sdk';
import { getFirebaseAdmin } from 'next-firebase-auth';
import firebase from 'firebase-admin';

class DBServiceServer implements IReferenceDB {
  isAdmin = true;
  db!: firebase.firestore.Firestore;

  constructor() {
    this.db = getFirebaseAdmin().firestore();
  }
  private getCollection(collectionName: string) {
    return this.db.collection(collectionName);
  }

  transformDateTo(date: Date) {
    return firebase.firestore.Timestamp.fromDate(date);
  }

  transformDateFrom(object: firebase.firestore.Timestamp): Date {
    return object.toDate();
  }

  async get<Model extends models.IBaseEntityModel>(
    collectionName: string,
    id: string,
  ): Promise<Model | undefined> {
    const document = this.getCollection(collectionName).doc(id);
    const res = await document.get();

    const dataResponse = res.data();

    if (res.exists && dataResponse) {
      return dataResponse as Model;
    }

    return undefined;
  }

  async persist<Model extends models.IBaseEntityModel>(
    collectionName: string,
    data: Model,
  ): Promise<Model> {
    if (!(data as unknown as { id: string }).id)
      throw new Error('ID is not defined');

    const document = this.getCollection(collectionName).doc(
      (data as unknown as { id: string }).id,
    );
    await document.set({
      ...data,
    });
    const res = await document.get();
    const dataResponse = res.data();
    if (dataResponse) {
      return dataResponse as Model;
    }

    throw new Error(`Model - ${collectionName} item not found`);
  }

  private getQueryWithParamsArray(
    collectionName: string,
    queryParams: IWhereParam[] = [],
  ): firebase.firestore.Query {
    let query: FirebaseFirestore.Query = this.getCollection(collectionName);

    for (const param of queryParams.filter((qp) => {
      return qp.key === 'orderBy';
    })) {
      query = query.orderBy(param.value as never, param.operator as never);
    }

    for (const param of queryParams.filter((qp) => {
      return qp.key === 'limit';
    })) {
      query = query.limit(param.value as number);
    }

    for (const param of queryParams.filter((qp) => {
      return qp.key !== 'orderBy' && qp.key !== 'limit';
    })) {
      query = query.where(param.key, param.operator as never, param.value);
    }
    return query;
  }

  async where<Model>(
    collectionName: string,
    queryParams: IWhereParam[],
  ): Promise<Model[]> {
    const query = this.getQueryWithParamsArray(collectionName, queryParams);
    const qs = await query.get();
    return qs.docs.map((doc) => {
      return doc.data() as unknown as Model;
    });
  }
}

export const getSSRSDKServices = () => {
  const sdkServices = getSDKServices();
  sdkServices.base.referenceService.db = new DBServiceServer();
  if (!sdkServices.base.backendService.externalApi) {
    sdkServices.base.backendService.externalApi = process.env.NEXT_PUBLIC_API;
  }
  return sdkServices;
};
