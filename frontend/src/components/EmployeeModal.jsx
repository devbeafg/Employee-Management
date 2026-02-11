import { backendUrl } from '../App'
import { queryClient } from '../utils/queryClients'
import { useMutation } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react'

import toast from 'react-hot-toast';

const EmployeeModal = ({children, type= "add", data}) => {

  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState(
    type === "add" ? {name: "", email: "", age: "", salary: "", role: ""} : data
  );

  useEffect(() => {
  if (type === "add") {
    setInfo({
      name: "",
      email: "",
      age: "",
      salary: "",
      role: ""
    });
  } else if (data) {
    setInfo(data);
  }
  }, [type, data, open]);

  const handleChanges = (e) =>{
    setInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }


  const addMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if(!res.ok) throw new Error(result.error)
        return result
    },

    onSuccess: ()=> {
      toast.success("Employee added successfully");
      setOpen(false);
      queryClient.invalidateQueries({queryKey: ["employee_details"]})
    },
    onError: (err) =>  toast.error(err.message)
  });

  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${backendUrl}/${payload.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      })
      
  const result = await res.json();

      if(!res.ok) throw new Error(result.error)
        return result
    },

    onSuccess: ()=> {
      toast.success("Employee updated successfully");
      setOpen(false);
      queryClient.invalidateQueries({queryKey: ["employee_details"]})
    },
    onError: (err) =>  toast.error(err.message)
  });

  const handleFormSubmission = ()=> {
    const required = ["name", "email", "age", "role", "salary"];

    for(const field of required){
      if(!info[field]?.toString().trim()){
        return toast.error("Please fill all fields")
      }
    }

    type === "add" ? addMutation.mutate(info) : updateMutation.mutate(info)

  }

  return (
    <div>
      <div className='inline-block' onClick={()=> setOpen(true)}>{children}</div>
    {
      open && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div onClick={() => setOpen(false)} className='absolute inset-0 bg-black/40'/>
            <div className='relative w-full max-w-md mx-4 rounded-2xl bg-gray-100 p-6 shadow-[10px_10px_25px_#c5c5c5, -10px_-10px_25px] animate-fadeIn'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-lg font-semibold text-gray-700'>{type === "add" ? "Add Employee" : "Update Employee"}</h2>
                <button onClick={() => setOpen(false)} className='text-gray-500 hover:text-gray-700'>x</button>
              </div>

              <div className='space-y-4'>
                {[
                  {label: "Name", name: "name"},
                  {label: "E-mail", name: "email"},
                  {label: "Age", name: "age", type:"number"},
                  {label: "Salary", name: "salary"},
                ].map((field)=> (
                  <div key={field.name}>
                    <label className='block text-sm text-gray-600 mb-1'>{field.label}</label>
                    <input type={field.type || "text"}
                    name={field.name}
                    value={info[field.name]}
                    onChange={handleChanges}
                    className='w-full px-4 py-2 rounded-xl bg-gray-100 shadow-inner outline-none focus:ring-2 focus:ring-blue-400'></input>
                  </div>
                ))}
              </div>

              <div>
                <label className='block text-sm text-gray-600 mb-1'>Role</label>
                <select value={info.role} onChange={(e)=> setInfo((prev)=> ({
                  ...prev, role: e.target.value
                }))} className='w-full px-4 py-2 rounded-xl bg-gray-100 shadow-inner outline-none focus:ring-2 focus:ring-blue-400'>
                <option value="">Select role</option>
                <option value="Developer">Developer</option>
                <option value="Manager">Manager</option>
                <option value="Sales">Sales</option>
                <option value="Intern">Intern</option>
                </select>
              </div>

              <div className='flex justify-end gap-4 mt-8'>
                <button onClick={()=> setOpen(false)} className='px-4 py-2 rounded-xl bg-gray-100 shadow-[3px_3px_6px_#c5c5c5, -3px_-3px_6px_#ffffff] hover:shadow-inner'>Cancel</button>
                <button onClick={handleFormSubmission} className='px-6 py-2 rounded-xl bg-blue-500 text-white shadow-lg transition hover:bg-blue-600'>{type === "add" ? "Add" : "Update"}</button>
              </div>
            </div>
          </div>
      )
    }
    </div>
  )
}

export default EmployeeModal