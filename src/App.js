import { useState, useEffect } from "react"; 
import initialState from './data.js';
import DatePicker from "react-datepicker";
import moment from 'moment'

import "react-datepicker/dist/react-datepicker.css";

function App() {
  //initial data from data.js
  let [datas, setDatas]= useState(initialState);
  let [searchDatas, setSearchDatas] = useState(initialState);
  // set search term
  const [search, setSearch] = useState('');
  const [error, setError] = useState(false);
  const [date, setDate] = useState('');
  const [sum, setSum] = useState(0);
  // handle top search box  input
  const handleSearch  = event => {
    const value = event.target.value;
    setSearch(value);  
  }

  // Search data from data.js and show right filter
  const searchData = (search, date) => {
    
    const keyword = search.toLowerCase();
    let filtered = [];
    filtered = datas.filter(x =>
      x.title.toLowerCase().includes(keyword) ||
      x.division.toLowerCase().includes(keyword) ||
      x.project_owner.toLowerCase().includes(keyword) ||
      x.budget.toString().includes(keyword)
    )     
    if (date) {
      let newDate = moment(date).format("MM/DD/YYYY"); 
      filtered = filtered.filter(x => x.created.includes(newDate));    
    }

    if (filtered.length > 0) {
      setSearchDatas(filtered);
      setError(false);
    } else {
      setError(true);
    }
  } 
  // useEffect for search data load when changes
  useEffect(() => {
    searchData(search, date);  
    setSum(0);
  }, [search, date]); 

  // Edit data 
  const Edit = (id) => {
    let obj = datas.map(el => {
      if (el.id === id) {
        return {
          ...el,
          edit: true
        }
      }
      return el;
    })
   
    setDatas(obj);
    setSearchDatas(obj);
  }
  /**
   * useeffect for set document title,
   * from data.js every object add property edit 
   * for edit data
   */
  useEffect(() => {
    document.title = "Project Dashboard"
    let obj = [...datas].map(el => {
      return {
        ...el,
        edit: false
      }
    });  
    setDatas(obj);
    setSearchDatas(obj);
  }, []);


  // handlle change for all input change 
  const handleChange = (e, id, field) => { 
    let data = [...datas];
      const newData = data.map((item) => {
        if (item.id === id) {   
          if (field == 'modified') {
            let modifiedDate = moment(e).format("MM/DD/YYYY"); 
               return {
                ...item,
                'modified': modifiedDate
              }
          }
          else if (field == 'created') {
            let createdDate = moment(e).format("MM/DD/YYYY"); 
              return {
                ...item,
                'created': createdDate
              }
           } else {
             return {
              ...item,
              [e.target.name]: e.target.value 
            }
          }
        } 
        return item; 
      }) 
    setDatas(newData);
    setSearchDatas(newData);
  }

  // for save after edit
  const saveChange = (id) => { 
      let obj = datas.map(el => {
      if (el.id === id) {
        return {
          ...el,
          edit: false
        }
      }
      return el;
    }) 
    setDatas(obj);
    setSearchDatas(obj);
  }
  // Statistics all record 
  const sumOfBudget = () => {
    const data = [...searchDatas];
    const allBudget = data.reduce((a, { budget }) => a + budget, 0);
    setSum(allBudget);
  }

  // this for list item controll
  const Databox = (el) => {
    return (<div className="relative p-5 bg-teal-100 shadow-lg shadow-blue-50 rounded-md mb-5" key={el.id}>
      <div className="flex items-center gap-2 absolute right-0 top-0">
        {!el.edit && 
          <>
            <button className="px-4 py-1 text-sm bg-cyan-500 text-white rounded-lg">View</button>
            <button className="px-4 py-1 text-sm bg-emerald-500 text-white rounded-lg" onClick={ () => Edit(el.id)}>Edit</button>
          </>
        } 
        {el.edit && 
          <> 
            <button onClick={() => saveChange(el.id)} className="px-4 py-1 text-sm bg-purple-600  text-white rounded-lg">Save</button>
          </>
        } 
      </div> 
      <ul className="" >
        {!el.edit ? (
          <>
            <li className="py-2 bg-white shadow-sm shadow-gray-300 px-5 mb-2 rounded-md">{el.title}</li>
            <li className="py-2 bg-white shadow-sm shadow-gray-300 px-5 mb-2 rounded-md">{el.division}</li>
            <li className="py-2 bg-white shadow-sm shadow-gray-300 px-5 mb-2 rounded-md">{el.project_owner}</li>
            <li className="py-2 bg-white shadow-sm shadow-gray-300 px-5 mb-2 rounded-md">${el.budget}</li>
            <li className="py-2 bg-white shadow-sm shadow-gray-300 px-5 mb-2 rounded-md">{el.status}</li>
            <li className="py-2 bg-white shadow-sm shadow-gray-300 px-5 mb-2 rounded-md">{el.created}</li>
            <li className="py-2 bg-white shadow-sm shadow-gray-300 px-5 rounded-md">{el.modified}</li>
          </>
        ) : (
            <>
              <li className="pb-2">
                <input type="text" name="title" onChange={(e) => handleChange(e, el.id) } value={el.title} className="px-5 py-2 w-full rounded-lg border border-gray-400 focus:outline-none" />
              </li>
              <li className="pb-2">
                <input type="text" name="division" onChange={(e) => handleChange(e, el.id)} value={el.division} className="px-5 py-2 w-full rounded-lg border border-gray-400 focus:outline-none" />
              </li>
              <li className="pb-2">
                <input type="text" name="project_owner" onChange={(e) => handleChange(e, el.id)} value={el.project_owner} className="px-5 py-2 w-full rounded-lg border border-gray-400 focus:outline-none" />
              </li>
              <li className="pb-2">
                <input type="number" name="budget" onChange={(e) => handleChange(e, el.id)} value={el.budget} className="px-5 py-2 w-full rounded-lg border border-gray-400 focus:outline-none" />
              </li>
              <li className="pb-2">
                <select name="status"  defaultValue={el.status} onChange={(e) => handleChange(e, el.id)} className="px-5 py-2 w-full rounded-lg border border-gray-400 focus:outline-none">
                  <option value="working">Working</option>
                  <option value="new">New</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </li>
              <li className="pb-2">
                 <DatePicker placeholderText="Date"  format="MM/dd/YY" selected={new Date(el.created)} className="px-5 py-2 w-full rounded-lg border border-gray-400 focus:outline-none" onChange={(date) => handleChange(date, el.id, 'created')} />  
              </li>
              <li className="pb-2">
                <DatePicker placeholderText="Date"  format="MM/dd/YY" selected={new Date(el.modified)} className="px-5 py-2 w-full rounded-lg border border-gray-400 focus:outline-none" onChange={(date) => handleChange(date, el.id, 'modified')} />  
              </li>
            </>
          )}
        </ul>
    </div>);
  }
   
  
  return ( 
    <div className="container mx-auto py-5 px-5"> 
      <div className="w-6/12 mx-auto">
        <section className="filter--area bg-cyan-600 py-4 px-3 rounded-md">
          <div className="flex items-center gap-10">
            <h2 className="text-lg text-white flex-shrink-0">Search By: </h2>  
            <input type="text" placeholder="Search" onChange={handleSearch} className="py-2 px-5 border border-gray-200 rounded-md" />
            <span className="text-white">Or</span>
            <DatePicker placeholderText="Date" format="MM/dd/YY" selected={date} className="py-2 px-5 border border-gray-200 rounded-md" onChange={(date) => setDate(date)} /> 
          </div>
        </section>
        <section className="pt-5 px-5 flex items-center justify-between">
          <button type="button" className="px-5 py-2 bg-blue-600  text-white rounded-lg">Add a new record</button>
          <button type="button" className="px-5 py-2 bg-pink-600  text-white rounded-lg" onClick={sumOfBudget}>Sum of budget</button>
          <button type="button" className="px-5 py-2 bg-sky-400 text-white rounded-lg">Export PDF</button>
        </section>
        {
          sum != 0 && <h1 className="w-full text-center text-lg pt-4 pb-2 text-blue-500 font-bold">${sum}</h1>
        } 
        <main className="py-5 grid grid-cols-2 gap-5">
          { !error && searchDatas.map(el => Databox(el))}  
        </main>
        { error && <h2 className="w-full text-center text-red-800 pt-10 text-lg">Item not found you search term!</h2>}
      </div>
    </div>
  );
}

export default App;
