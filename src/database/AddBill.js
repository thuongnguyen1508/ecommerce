import { firebaseFirestore } from './InstanceFiresbase.js'
import { collection, addDoc } from 'firebase/firestore'

export async function CreateBill(bill) {
    const collectionRef = collection(firebaseFirestore, '/bills')
    const docRef = await addDoc(collectionRef, bill);
    return docRef.id
}