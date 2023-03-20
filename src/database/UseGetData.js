import React, { useState } from 'react'
import { firebaseFirestore } from './InstanceFiresbase'
import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import { useEffect } from 'react'
import { async } from '@firebase/util'

function UseGetData(collectionName) {

    const [data, setData] = useState([])
    const collectionRef = collection(firebaseFirestore, collectionName)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getData = async () => {
            await onSnapshot(collectionRef, (snapshot) => {
                setData(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
                setLoading(false);
            })

        }

        getData()
    }, []);
    return { data, loading }
}

export default UseGetData