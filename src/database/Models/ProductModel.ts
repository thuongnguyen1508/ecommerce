import 'firebase/firestore/lite'
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore/lite';

export class ProductModel {
    constructor(
        readonly id: string,
        readonly productName: string,
        readonly imgThumb: string,
        readonly imgUrls: [],
        readonly cateogry: string,
        readonly price: number,
        readonly isTrending: boolean,
        readonly shortDesc: string,
        readonly description: object,
        readonly avgRating: number,
        readonly reviews: []) { }

    static productConvert = {
        toFirestore(product: ProductModel): DocumentData {
            return {
                productName: product.productName,
                imgThumb: product.imgThumb,
                imgUrls: product.imgUrls,
                cateogry: product.cateogry,
                price: product.price,
                isTrending: product.isTrending,
                shortDesc: product.shortDesc,
                description: product.description,
                avgRating: product.avgRating,
                reviews: product.reviews
            }
        },
        fromFirestore(
            snapshot: QueryDocumentSnapshot,
            options
        ): ProductModel {
            const data = snapshot.data()!;
            return new ProductModel(
                snapshot.id,
                data.productName,
                data.imgThumb,
                data.imgUrls,
                data.category,
                data.price,
                data.isTrending,
                data.shortDesc,
                data.description,
                data.avgRating,
                data.reviews);
        }
    }

    static fromJSON(object): ProductModel {
        return new ProductModel(
            '',
            object.productName,
            object.imgThumb,
            object.imgUrls,
            object.category,
            object.price,
            object.isTrending,
            object.shortDesc,
            object.description,
            object.avgRating,
            object.reviews
        );
    }
}

