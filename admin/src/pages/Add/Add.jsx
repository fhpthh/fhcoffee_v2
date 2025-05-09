import React, { useState } from 'react'
import './Add.css'
import assets from '../../assets/assets'
import axios from "axios"
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const Add = ({url}) => {
    
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Cafe"
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }


    const onSubmitHandler = async (event) => {
        event.preventDefault();
        console.log("Submit pressed"); // Kiểm tra nút hoạt động

        const formData = new FormData();
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", Number(data.price))
        formData.append("category", data.category)
        formData.append("image", image)

        // Log the data being sent
        console.log("Sending data:", {
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            image: image ? image.name : "No image"
        });

        try {
            const response = await axios.post(`${url}/api/food/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log("Response:", response.data);

            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Cafe"
                })
                setImage(false)
                toast.success("Success")
            }
            else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.error("Error details:", error.response?.data);
        }
    }

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Tải ảnh</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.uploadarea} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />
                </div>

                <div className="add-product-name flex-col">
                    <p>Sản phẩm</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Tên sản phẩm' />
                </div>

                <div className='add-product-description flex-col'>
                    <p>Mô tả sản phẩm</p>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Nội dung'></textarea>
                </div>

                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Phân loại sản phẩm</p>
                        <select name="category" onChange={onChangeHandler} value={data.category}>
                            <option value="Cafe">Cà phê</option>
                            <option value="Matcha">Matcha</option>
                            <option value="Milktea">Trà sữa</option>
                            <option value="Tea">Trà</option>
                            <option value="Cake">Bánh ngọt</option>
                        </select>
                    </div>

                    <div className="add-price flex-col">
                        <p>Tổng tiền</p>
                        <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='20 000' />
                    </div>
                </div>

                <button type='submit' className='add-btn'>THÊM</button>
            </form>
        </div>
    )
}

export default Add
