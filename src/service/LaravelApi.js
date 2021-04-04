import axios from 'axios';
const url = 'http://127.0.0.1:8000/api/';

export default class LaravelApi {
    async getProducts() {
        return await axios
            .get(url+'products')
            .then(res=>{
            console.log(res.data);
            return res.data
            })
    }

    async editProducts(products)
    {
        if(products)
        {
            let array = [];
            let data = [];
            
            array = [...products];
    
            array.forEach(element => {
                if(element)
                    data = [...data, {"id":element.id,"name":element.name,"price":element.price,"quantity":element.quantity}]
            });
    
            let send = {"data":data};
            console.log(send);
            if(send.data.length>0)
            {
                console.log('Data to update:',send);
                await axios.put(url+'products/update',send)
            }else
            {
                console.log('Nothing to update.');
            }
        }else
        {
            console.log('Nothing to update.');
        }

    }

    async createProducts(products)
    {
        if(products)
        {
            let array = [];
            let data = [];
            
            array = [...products];
    
            array.forEach(element => {
                if(element)
                    data = [...data, {"id":element.id,"name":element.name,"price":element.price,"quantity":element.quantity}]
            });
            let send = {"data":data};
            console.log(send);
            if(send.data.length>0)
            {
                console.log('Data to create:',send);
                await axios.post(url+'products',send);
                
            }else
            {
                console.log('Nothing to update.');
            }
        }else
        {
            console.log('Nothing to update.');
        }
    }

    async deleteProduct(product)
    {
        if(product)
        {
            console.log('Data to delete:',product);
            await axios.delete(url+'products/'+product.id);
        }else
        {
            console.log('Nothing to update.');
        }
    }

    async getProductHistory(id)
    {
        console.log('di',id);
    }
}
    