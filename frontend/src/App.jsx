import React from 'react'
import EmployeeTable from './components/EmployeeTable';
import EmployeeModal from './components/EmployeeModal';
import {useQuery} from '@tanstack/react-query';

export const backendUrl = 'https://employee-management-zxyk.onrender.com/api/employee';

const App = () => {
  async function fetchEmployeeDetails() {
    const res = await fetch(backendUrl);
    const data = await res.json();

    if(!res.ok){
      throw new Error(data.error);
    }
    return data;
  }

  const {isPending, isError, data, error} = useQuery({
    queryKey: ["employee_details"],
    queryFn: fetchEmployeeDetails,

  });

  if(isPending){
    return(
      <div>Loading</div>
      
    )
  }

  if(isError){
    return(
      <div>{error.message}</div>
    )
  }
  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <div className='max-w-7xl mx-auto space-y-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-semibold justify-between'>Employee Management</h1>
          <EmployeeModal type="add">
            <button className='px-5 py-2 rounded-xl bg-gray-100 text-gray-700 shadow-[4px_4px_8px_#c5c5c5, -4px_-4px_8px_#ffff]'>
              Add Employee</button></EmployeeModal>
        </div>
        <EmployeeTable data={data}></EmployeeTable>
      </div>
    </div>
  )
}

export default App