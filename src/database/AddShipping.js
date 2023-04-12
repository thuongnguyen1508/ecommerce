import { firebaseFirestore } from './InstanceFiresbase.js'
import { collection, addDoc } from 'firebase/firestore'

export async function CreateShipping(shipping) {
    const collectionRef = collection(firebaseFirestore, '/shippings')
    const docRef = await addDoc(collectionRef, shipping);
    return docRef.id
}