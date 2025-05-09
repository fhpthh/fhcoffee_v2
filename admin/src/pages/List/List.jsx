import React, {useState} from 'react'
import './List.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
const List = ({url}) => {

  
  const [list, setList] = useState([]);
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
 
    if (response.data.success) {
      setList(response.data.data);
    }
    else {
      toast.error("Error")
    }
  }

  const removeFood = async(foodId) => {
  const response = await axios.delete(`${url}/api/food/remove`, { data: { id: foodId } });
  await fetchList();
  if (response.data.success) {
    toast.success("Success");

  } else {
    toast.error("Error")
  }
}

  useEffect(()=> {
    fetchList();
  }) 
  return (
    <div className='list add lex-col'>
      <p>Danh sách sản phẩm</p>
      <div className="list-table">
        <div className='table-format-title'>
          <b>Ảnh</b>
          <b>Tên</b>
          <b>Phân loại</b>
          <b>Giá</b>
          <b>Hành động</b>

        </div >
        {list.map((item, index)=>{
          return (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/`+item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price.toLocaleString()+'đ'}</p>
              <p onClick={()=>removeFood((item._id))}>X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List
