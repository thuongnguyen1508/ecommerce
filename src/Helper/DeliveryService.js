export class DeliveryService {
    constructor(baseURL = "", token = "") {
        this.baseURL = baseURL;
        this.token = token;
    }

    getDistrict = async (provinceID) => {
        const res = await fetch(`${this.baseURL}/master-data/district`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Token": this.token
            },
            body: JSON.stringify({ province_id: provinceID })
        })
        .then(response => response.json())
        .catch(error => console.log(error));

        return res.data;
    }

    getWard = async (districtID) => {
        const res = await fetch(`${this.baseURL}/master-data/ward`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Token": this.token
            },
            body: JSON.stringify({ district_id: districtID })
        })
        .then(response => response.json())
        .catch(error => console.log(error));

        return res.data;
    }

    getDeliveryMethod = async (shopID, fromDistrictID, toDistrictID) => {
        const bonusMethod = {
            "service_id": 0,
            "short_name": "Chuyển phát truyền thống",
            "service_type_id": 5
        };

        const res = await fetch(`${this.baseURL}/v2/shipping-order/available-services`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Token": this.token
            },
            body: JSON.stringify({ 
                shop_id: shopID,
                from_district: fromDistrictID,
                to_district: toDistrictID 
            })
        })
        .then(response => response.json())
        .catch(error => console.log(error));

        const methods = [bonusMethod, ...res.data]
        return methods;
    }

    getEstimatedFee = async (fromDistrictID, toDistrictID, toWardCode, serviceID, quantity, dimentions) => {
        const res = await fetch(`${this.baseURL}/v2/shipping-order/fee`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Token": this.token
            },
            body: JSON.stringify({ 
                from_district_id: fromDistrictID,
                service_id: serviceID,
                to_district_id: toDistrictID,
                to_ward_code: toWardCode,
                height: dimentions.height,
                length: dimentions.length,
                weight: parseInt(200*quantity),
                width: 20
            })
        })
        .then(response => response.json())
        .catch(error => console.log(error));
        
        return parseInt(res.data.service_fee);
    }

    getEstimatedTime = async (fromDistrictID, toDistrictID, fromWardCode, toWardCode, serviceID) => {
        const res = await fetch(`${this.baseURL}/v2/shipping-order/leadtime`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Token": this.token
            },
            body: JSON.stringify({ 
                from_district_id: fromDistrictID,
                from_ward_code: fromWardCode,
                to_district_id: toDistrictID,
                to_ward_code: toWardCode,
                service_id: serviceID
            })
        })
        .then(response => response.json())
        .catch(error => console.log(error));

        return res.data.leadtime;
    }

    createShippingOrder = async (
        paymentTypeID, note, toName, toPhone, toAddress, toWardName, toDistrictName, 
        toProvinceName, dimention, items, serviceID
    ) => {
        const shopID = parseInt(process.env.REACT_APP_SHOP_ID);
        const sampleSource = {
            from_ward_name: "Phường 5",
            from_district_name: "Quận 11",
            from_province_name: "TP Hồ Chí Minh"
        }
        const res = await fetch(`${this.baseURL}/v2/shipping-order/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Token": this.token
            },
            body: JSON.stringify({ 
                payment_type_id: paymentTypeID,
                note: note,
                shop_id: shopID,
                from_ward_name: sampleSource.from_ward_name,
                from_district_name: sampleSource.from_district_name,
                from_province_name: sampleSource.from_province_name,
                required_note: "CHOTHUHANG",
                to_name: toName,
                to_phone: toPhone,
                to_address: toAddress,
                to_ward_name: toWardName,
                to_district_name: toDistrictName,
                to_province_name: toProvinceName,
                weight: dimention.weight,
                length: dimention.length,
                width: dimention.width,
                height: dimention.height,
                service_id: serviceID,
                service_type_id: 2,
                items: items
            })
        })
        .then(response => response.json())
        .catch(error => console.log(error));

        return res.data;
    }
}
