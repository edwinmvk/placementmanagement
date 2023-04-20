import React, {useState, useEffect} from "react";
import 'tachyons';
import { Typography, Table, Avatar, Button, Form, Input, Modal } from "antd";
import { LocalDetails } from './LocalDetails';
import { useForm } from "antd/es/form/Form";

const ManageStudents= () =>{
    return(
        <div className= "pl3 pr3">
            <Typography.Title level= {3}>Manage Student Details</Typography.Title>
            <DatabaseData />
        </div>
    )
}

const DatabaseData= () => {
    const [statedata, setstatedata]= useState(LocalDetails); // useState([])  // this state will eventually hold ALL the data from the DATABASE
    const [editfield, seteditfield]= useState(null); // this state will eventually hold the username of the ROW to be EDITED 
    const [managestudentsform]= useForm();      // this state is use to represent and identify the form that is being used, with a name

    // useEffect(()=> {
    //     fetch('http://jsonplaceholder.typicode.com/photos')
    //     .then((response) =>{          
    //         return response.json();
    //     })
    //     .then(readabledata => {
    //         setstatedata(readabledata); 
    //     })
    // }, []);

    const columns= [
        {
            title: "Picture", // This is the column name in table which we can now itself
            dataIndex: "picture", // This is the column name from the database which is already preassigned
            fixed: 'left',
            width: 100,
            render: (link)=> {   // for showing photos
                return <Avatar src= {link}/>
            }
        },
        {
            title: "Username",
            dataIndex: `username`, // ??? need to convert .toUpperCase()
            fixed: 'left',
            width: 150,
        },
        {
            title: "Name",
            dataIndex: "name", 
            width: 200,    

            // the below code makes the field editable
            render: (text, record)=> { // record means the ALL DATA in that ROW only.
                if(editfield === record.username){ // this condition/loop checks each records's username till it matches the "editfield state's username"
                    return <Form.Item
                        name= "name" // "name" should be same as dataIndex
                        rules= {[{
                            required: true,
                            message: "Cannot be empty"
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                }else
                    return <p>{text}</p>
            }  
        },
        {
            title: "Passout Year",
            dataIndex: "passoutyear", 
            sorter: true, 
            width: 150,  
            render: (text, record)=> {
                if(editfield === record.username){
                    return <Form.Item
                        name= "passoutyear"
                        rules= {[{
                            required: true,
                            message: "Cannot be empty"
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                }else
                    return <p>{text}</p>
            }           
        },
        {
            title: "Arrears",
            dataIndex: "arrears", 
            sorter: true, 
            width: 100,  
            render: (text, record)=> {
                if(editfield === record.username){
                    return <Form.Item
                        name= "arrears"
                        rules= {[{
                            required: true,
                            message: "Cannot be empty"
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                }else
                    return <p>{text}</p>
            }           
        },
        {
            title: "SGPA",
            dataIndex: "sgpa",  
            sorter: true,  
            width: 100,
            render: (text, record)=> {
                if(editfield === record.username){
                    return <Form.Item
                        name= "sgpa"
                        rules= {[{
                            required: true,
                            message: "Cannot be empty"
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                }else
                    return <p>{text}</p>
            }         
        },
        {
            title: "Password",
            dataIndex: "password", 
            width: 200,
            render: (text, record)=> {
                if(editfield === record.username){
                    return <Form.Item
                        name= "password"
                        rules= {[{
                            required: true,
                            message: "Cannot be empty"
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                }else
                    return <p>{text}</p>
            }              
        },
        {
            title: "Actions",
            fixed: 'right',
            width: 300,
            render: (_, record)=> { // record means the ALL DATA in that ROW only.
                return <>
                    <Button 
                        type= "text" className= "bg-blue white" 
                        onClick= {()=> {
                            onClickUpdate(record)
                        }}>
                        Update
                    </Button>
                    <Button 
                        type= "text" className= "ml2 bg-green white"
                        htmlType= "submit">
                        Save
                    </Button>
                    <Button 
                        type= "text" className= "ml2 bg-orange white"
                        onClick= {()=> {
                            onClickDelete(record)
                        }}>
                        Remove user
                    </Button>
                </>
            }
        }
    ]

    const onClickUpdate= (record)=> {
        seteditfield(record.username); // the state variable 'editfield' now contains the unique username of the "ROW to be edited"
        managestudentsform.setFieldsValue({ // the state variable 'managestudentsform' now contains the already present values in its fields
            name: record.name,
            passoutyear: record.passoutyear,
            arrears: record.arrears,
            sgpa: record.sgpa,
            password: record.password
        })
    }

    const onClickDelete= (record)=> {
        Modal.confirm({
            title: `Are you sure, you want to delete?`,
            okText: 'Yes',
            okType: "danger",
            onOk: ()=> {
                setstatedata(previousstatedata => {
                    return previousstatedata.filter(student => student.username !== record.username)
                })
            }
        })
    }

    const onClickSave= (changedvalues)=> { // html type "submit" is related to the prop onFinish. This then triggers the onClickSave funtion with the CHANGED VALUES ONLY as the parameters.
        const updatedStateData= [...statedata] // all the DATABASE data that we fetched at begining, is copied to another variable updatedStateData
        const index= statedata.findIndex(obj => obj.username === editfield) // finding the index of the row object to be spliced from array using the unique username of the object
        updatedStateData.splice(index, 1, { picture: statedata[index].picture, username: editfield, ...changedvalues });
        setstatedata(updatedStateData);
        // console.log(updatedStateData);
        seteditfield(null);
    }

    return(
        <Form form= {managestudentsform} onFinish= {onClickSave}> {/*form is keyword which acts as a prop in FORMS*/}
            <Table style={{maxWidth: 1000}} 
                columns= {columns}
                dataSource= {statedata}
                // pagination= {false} // to remove the down navigation buttons
                scroll= {{x: 1000, y: 500}}
            ></Table>
        </Form>
    )
}

export default ManageStudents;