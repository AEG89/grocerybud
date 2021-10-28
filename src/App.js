import React, {useState, useEffect} from 'react';
import './App.css';
import List from './List';
import Alert from './Alert';

const getLocalStorage = () => {
  let list= localStorage.getItem('list');
  if(list){
    return JSON.parse(localStorage.getItem('list'))
  }
  else{
    return []
  }
}

function App() {
const [name,setNAme] = useState('');
const [list, setList] = useState(getLocalStorage());
const [isEditing, setIsEditing] = useState(false);
const [editId, setEditId] = useState(null);
const [alert, setAlert] = useState({ 
  show: false,
  msg: '',
  type:'',
})
const handleSubmitt = (e) => {
  e.preventDefault();
  
  if(!name){
    showAlert(true,'danger', 'Please enter value')
  }
  else if(name && isEditing){
    setList(
      list.map((item) => {
        if(item.id === editId) {
          return {...item, title:name}
        }
        return item
      })
    )
    setNAme('');
    setEditId(null);
    setIsEditing(false);
  }
  else{
    showAlert(true,'success','Item added to the list')
    const newItem = {id : new Date().getTime().toString(),
    title:name};
    setList([...list,newItem]);
    setNAme('');
    showAlert(true,'success','You have edited');
  }
}

const showAlert = (show=false, type="", msg="") => {
  setAlert({show,type,msg})
}

const clearList = () => {
  showAlert(true,'danger','You are deleting all');
  setList([]);
}
 
const removeItem = (id) => {
  showAlert(true,'danger','you are removing item');
  setList(list.filter((item) => item.id !== id))
}

const editItem = (id) => {
  
  const specificItem = list.find((item) => item.id === id);
  setIsEditing(true);
  setEditId(id);
  setNAme(specificItem.title)
  
}

useEffect(() => {
  localStorage.setItem('list',JSON.stringify(list))
}, [list]) 


  return <section className="section-center">
    <form className="grocery-form" onSubmit={handleSubmitt}>
      {alert.show && <Alert {...alert} removeAlert={showAlert}
      list={list} />}
      <h3>Grocery Bud</h3>
      <div className="form-control">
        <input type="text" className='grocery' placeholder='eg. eggs' 
        value={name} onChange={(e) => setNAme(e.target.value)} />
        <button type="submit" className="submit-btn">
          {isEditing ? 'edit': 'submit'}
        </button>
      </div>
    </form>
    {list.length > 0 && (
    <div className="grocery-container">
      <List items={list} removeItem={removeItem} editItem={editItem} />
      <button className="clear-btn" onClick={clearList}>Clear Items</button>
    </div>
    )}
    
  </section>
  
}

export default App;
