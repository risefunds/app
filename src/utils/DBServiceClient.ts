import { models, IReferenceDB, IWhereParam } from '@risefunds/sdk';
import { firestore } from './firebaseConfig';
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  doc,
  setDoc,
  getDoc, // Use for single document
  getDocs, // Use for querying collections
  query,
  where,
  onSnapshot,
  Firestore,
  Timestamp,
  DocumentData,
  WhereFilterOp,
} from 'firebase/firestore';

export class DBServiceClient implements IReferenceDB {
  firestoreInstance: Firestore;

  constructor() {
    this.firestoreInstance = firestore;
  }
  transformDateTo(date: Date): Timestamp {
    return Timestamp.fromDate(date);
  }

  transformDateFrom(object: Timestamp): Date {
    return object.toDate();
  }

  connectToEmulator() {
    if (process.env.NEXT_PUBLIC_ENV === 'local') {
      connectFirestoreEmulator(this.firestoreInstance, 'localhost', 8080);
    }
  }

  isAdmin = false;

  private getCollection = <Model>(collectionName: string) => {
    return collection(this.firestoreInstance, collectionName);
  };

  // Use `getDoc` for a single document
  public async get<Model extends models.IBaseEntityModel>(
    collectionName: string,
    id: string
  ): Promise<Model | undefined> {
    const docRef = doc(this.getCollection<Model>(collectionName), id);
    const res = await getDoc(docRef); // Use getDoc here
    if (res.exists()) {
      const data = res.data();
      return data as Model;
    }
    return undefined;
  }

  public async persist<Model extends models.IBaseEntityModel>(
    collectionName: string,
    data: Model
  ): Promise<Model | undefined> {
    if (!data.id) throw new Error('ID is not defined');
    const docRef = doc(this.getCollection<Model>(collectionName), data.id);
    await setDoc(docRef, data);
    return this.get(collectionName, data.id); // Get the updated document
  }

  private getQueryWithParamsArray = <Model>(
    collectionName: string,
    queryParams: IWhereParam[] = []
  ) => {
    let collectionRef = this.getCollection<Model>(collectionName);
    let collectionQuery = query(collectionRef);

    queryParams.forEach((qp) => {
      const condition = where(qp.key, qp.operator as WhereFilterOp, qp.value);
      collectionQuery = query(collectionRef, condition); // Add conditions to query
    });

    return collectionQuery;
  };

  // Use `getDocs` for querying multiple documents
  public async where<Model>(
    collectionName: string,
    queryParams: IWhereParam[]
  ): Promise<Model[]> {
    const queryRef = this.getQueryWithParamsArray<Model>(
      collectionName,
      queryParams
    );

    const querySnapshot = await getDocs(queryRef); // Use getDocs here for multiple documents
    return querySnapshot.docs.map((doc) => doc.data() as Model);
  }

  // Subscribe to collection changes
  public subscribe<Model>(
    collectionName: string,
    queryParams: IWhereParam[],
    callBack: (error?: Error, data?: Model[]) => void
  ) {
    const queryRef = this.getQueryWithParamsArray<Model>(
      collectionName,
      queryParams
    );

    return onSnapshot(
      queryRef,
      (querySnapshot) => {
        callBack(
          undefined,
          querySnapshot.docs.map((doc) => doc.data() as Model)
        );
      },
      (error) => {
        callBack(error);
      }
    );
  }

  // Subscribe to a single document
  public subscribeDocument<Model>(
    collectionName: string,
    id: string,
    callBack: (error?: Error, data?: Model) => void
  ) {
    const docRef = doc(this.getCollection<Model>(collectionName), id);
    return onSnapshot(
      docRef,
      (documentSnapshot) => {
        callBack(undefined, documentSnapshot.data() as Model);
      },
      (error) => {
        callBack(error);
      }
    );
  }
}
