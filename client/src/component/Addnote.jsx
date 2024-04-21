import React ,{useEffect, useState} from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import { TextField } from "@material-ui/core";
import Autocomplete, 
{ createFilterOptions } from '@material-ui/lab/Autocomplete'; 
import SelectInput from "@material-ui/core/Select/SelectInput";
const filter = createFilterOptions(); 

export const Addnote = ({show,handleClose,edit,data}) => {
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.desc);
  const [category,setCategory]= useState();  // add category usesatate
  
  const [options,setOptions] =useState( ['One', 'Two', 'Three', 'Four']); 
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(`http://localhost:9090/api/Category/getByUser/${sessionStorage.getItem("email")}`);
        const data = await response.json();

        if(data.category !== null && data.length > 0){
            setOptions(data.category);
      }
      } catch (error) {
        console.error('Error fetching options:', error);
     
      }
    };

    fetchOptions();
  }, []);


  const handleCategory =async (category) => {
    const res = await fetch(`http://localhost:9090/api/Category/${sessionStorage.getItem("email")}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      });
  }



  const handleOptionChange = (newValue) => {
    // Here you can update the options array based on newValue
    // For example, adding the newValue to the options array
    setOptions(prevOptions => [...prevOptions, newValue]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Title or Description orCategory cannot be blank");}
    // else if(!category){
    // alert("Category cannot be blank");
    // }   
  else {
    if(!options.includes(category)){
      handleCategory(category);
    }
    if(edit){
      const res = await fetch(`http://localhost:9090/api/notes/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, category,  description }),
      });
    }else{

      const res = await fetch(`http://localhost:9090/api/notes/${sessionStorage.getItem("email")}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, category,  description  }),
      });
    }
  
    setDescription("");
    setTitle("");
    setCategory("");
    window.location.reload();
    handleClose();
  } 

  };
     



  return (
    
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form id="addnotesmodalTitle">
                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <div className="note-title">
                            <label>Note Title</label>
                            <input
                              type="text"
                              id="note-has-title"
                              className="form-control"
                              minLength={25}
                              onChange={(e) => setTitle(e.target.value)}
                              value={title}
                              placeholder="Title"
                            />
                          </div>
                        </div>
                        <div className="col-md-12 ">
                          <div className="note-description">
                            <label>Category</label>
                                <Autocomplete 
                                    filterOptions={(options, params) => { 
                                      const filtered = options.filter(option =>
                                        option.toLowerCase().includes(params.inputValue.toLowerCase())
                                    ); 
                                      // Suggest the creation of a new value 
                                      if (params.inputValue !== '') { 
                                         filtered.push(`Add: ${params.inputValue}`); 
                                      } 
                                      return filtered; 
                                    }} 
                                    selectOnFocus 
                                    clearOnBlur 
                                    handleHomeEndKeys 
                                    options={options} 
                                    renderOption={(option) => option} 
                                    freeSolo
                                    // value={category}
                                    onChange={(e, newValue) => {
                                      if(!options.includes(newValue)){
                                      setCategory(newValue.substring(4));
                                      handleOptionChange(newValue.substring(4));
                                     
                                      }
                                      else {
                                      setCategory(newValue);
                                      handleOptionChange(newValue); // Call the function to update options array
                                      }
                                    }}
                                    renderInput={(params) => ( 
                                      <TextField 
                                        className="form-control"
                                        {...params} 
                                        placeholder="Category"
                                        variant="outlined" 
                          
                                      
                                        /> 
                                    )} 
                                  /> 
                          </div>
                        </div>




                        <div className="col-md-12">
                          <div className="note-description">
                            <label>Note Description</label>
                            <textarea
                              id="note-has-description"
                              className="form-control"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                           
                              placeholder="Description"
                              rows={3}
                            
                            />
                          </div>
                        </div>
                      </div>
                    </form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
