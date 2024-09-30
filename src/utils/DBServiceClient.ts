import { models, IReferenceDB, IWhereParam } from '@risefunds/sdk';
import firebase from 'firebase';

export class DBServiceClient implements IReferenceDB {
  firestoreInstance: firebase.firestore.Firestore = firebase.firestore();

  constructor() {}

  transformDateTo(date: Date) {
    return firebase.firestore.Timestamp.fromDate(date);
  }

  transformDateFrom(object: firebase.firestore.Timestamp): Date {
    return object.toDate();
  }

  isAdmin = false;

  private getCollection = <Model>(collectionName: string) => {
    return this.firestoreInstance.collection(collectionName);
  };

  public get = async <Model extends models.IBaseEntityModel>(
    collectionName: string,
    id: string,
  ): Promise<Model | undefined> => {
    const docRef = this.getCollection<Model>(collectionName).doc(id);
    const res = await docRef.get();
    if (res.exists) {
      const data = res.data();
      return data as Model;
    }

    return undefined;
  };

  public persist = async <Model extends models.IBaseEntityModel>(
    collectionName: string,
    data: Model,
  ): Promise<Model | undefined> => {
    if (!(data as any).id) throw new Error('ID is not defined');
    const docRef = this.getCollection<Model>(collectionName).doc(data.id);
    await docRef.set(data);
    return this.get(collectionName, data.id);
  };

  private getQueryWithParamsArray = <Model>(
    collectionName: string,
    queryParams: IWhereParam[] = [],
  ) => {
    const whereQueries = queryParams.filter((qp) => qp.key !== 'orderBy');
    let collectionQuery: any = this.getCollection(collectionName);
    for (let qp of whereQueries) {
      collectionQuery = collectionQuery.where(
        qp.key,
        qp.operator as firebase.firestore.WhereFilterOp,
        qp.value,
      );
    }

    return collectionQuery as firebase.firestore.Query<firebase.firestore.DocumentData>;
  };

  public subscribe<Model>(
    collectionName: string,
    queryParams: IWhereParam[],
    callBack: (error?: Error, data?: Model[]) => void,
  ) {
    let query = this.getQueryWithParamsArray<Model>(
      collectionName,
      queryParams,
    );
    return query.onSnapshot(
      (querySnapshot) => {
        callBack(
          undefined,
          querySnapshot.docs
            .filter((d: any) => (d.data().createdAt ? true : false))
            .map((d) => {
              return d.data() as Model;
            }),
        );
      },
      (error) => {
        callBack(error);
      },
    );
  }

  public subscribeDocument<Model>(
    collectionName: string,
    id: string,
    callBack: (error?: Error, data?: Model) => void,
  ) {
    return this.getCollection(collectionName)
      .doc(id)
      .onSnapshot(
        (documentSnapshot) => {
          callBack(undefined, documentSnapshot.data() as Model);
        },
        (error) => {
          callBack(error);
        },
      );
  }

  public where = async <Model>(
    collectionName: string,
    queryParams: IWhereParam[],
  ): Promise<Model[]> => {
    let query = this.getQueryWithParamsArray<Model>(
      collectionName,
      queryParams,
    );

    const qs = await query.get();
    return qs.docs.map((doc) => {
      return doc.data() as Model;
    });
  };
}
