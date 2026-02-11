import React from 'react'
import { MdDeleteForever } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EmployeeModal from './EmployeeModal';
import { useMutation } from '@tanstack/react-query';
import { backendUrl } from '../App';
import toast from "react-hot-toast";
import { queryClient } from "../utils/queryClients";


const EmployeeTable = ({data}) => {

  if(!data?.length){
    return(
      <div>No employee data available</div>
    )
  }

  const mutation = useMutation({
    mutationFn: async (id)=> {
      const response = await fetch(`${backendUrl}/${id}`, {
        method: 'DELETE',
        headers: {"Content-Type": "application/json"}
      });

      const result = response.status !== 204 ? await response.json() : null;

      if(!response.ok) throw new Error(result.error)
        return result
    },

    onError: (error) => toast.error(error.message),
    onSuccess: ()=> {
      toast.success("Employee details deleted")
      queryClient.invalidateQueries({queryKey: ["employee_details"]})
    }
  })
  return (
    <div className='w-full overflow-x-auto'>
      <div className='min-w-[255px] bg-gray-100 rounded-xl p-6'>
        <table className='w-full'>
          <thead>
            <tr className='text-left text-sm text-gray-600'>
              <th className='py-3 px-4'>ID</th>
              <th className='py-3 px-4'>Name</th>
              <th className='py-3 px-4'>Email</th>
              <th className='py-3 px-4'>Age</th>
              <th className='py-3 px-4'>Role</th>
              <th className='py-3 px-4'>Salary</th>
              <th className='py-3 px-4'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item)=> (
              <tr key={item.id} className='text-sm text-gray-700 rounded-2xl transition hover:bg-gray-200/60 shadow-[inset_1px_1px_2px_#e5e5e5]'>
                <td className='py-4 px-4'>{item.id}</td>
                <td className='py-4 px-4'>{item.name}</td>
                <td className='py-4 px-4'>{item.email}</td>
                <td className='py-4 px-4'>{item.age}</td>
                <td className='py-4 px-4'>{item.role}</td>
                <td className='py-4 px-4'>{item.salary}</td>
                <td className='py-4 px-4'>
                  <div className='flex items-center gap-4'>
                    <button onClick={()=> mutation.mutate(item.id)} className='p-2 rounded-lg bg-gray-100 shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] hover:shadow-inner text-red-600 transition'><MdDeleteForever /></button>
                    <EmployeeModal data={item} type='update'> 
                      <button className='p-2 rounded-lg bg-gray-100 shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] hover:shadow-inner text-green-600 transition'><MdEdit /></button>
                    </EmployeeModal>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmployeeTable