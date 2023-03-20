//it is test

import { firebaseFirestore, firebaseStorage } from './InstanceFiresbase.js'
import { collection, getDocs, addDoc, updateDoc } from 'firebase/firestore/lite'
import { ref, uploadBytes } from 'firebase/storage'
import { async } from '@firebase/util'
import { ProductModel } from './Models/ProductModel.ts'
import product from "../assets/data/product"

export async function Test() {
    const mCollection = collection(firebaseFirestore, '/products').withConverter(ProductModel.productConvert)
    const mSnapshot = await getDocs(mCollection)
    const mDocs = mSnapshot.docs.map(doc => doc.data())
    console.log(mDocs)
}

export function Upload() {
    product.forEach(async (item) => {
        const mCollection = collection(firebaseFirestore, '/products').withConverter(ProductModel.productConvert)
        const model = ProductModel.fromJSON(item)
        const mDocRef = await addDoc(mCollection, model)
    })
}