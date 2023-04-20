import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../../../pages/admin/Home/Home";
import ManageStudents from "../../../pages/admin/ManageStudents/ManageStudents";
import NewPlacement from "../../../pages/admin/NewPlacement/NewPlacement";
import Responses from "../../../pages/admin/Responses/Responses";

const Content= () =>{
    return(
        <div>
            <Routes>
                <Route path= "/" element= {<Home/>}/>
                <Route path= "/newplacement" element= {<NewPlacement/>}/>
                <Route path= "/responses" element= {<Responses/>}/>
                <Route path= "/manage" element= {<ManageStudents/>}/>
            </Routes>
        </div>
    )
}

export default Content;
