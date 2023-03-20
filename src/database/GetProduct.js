import { firebaseFirestore } from './InstanceFiresbase.js'
import { getDoc, doc } from 'firebase/firestore'

export async function GetProductById(id) {
    const docSnap = await getDoc(doc(firebaseFirestore, `/products/${id}`))
    if (docSnap.exists())
        return docSnap.data();
    return null;
}