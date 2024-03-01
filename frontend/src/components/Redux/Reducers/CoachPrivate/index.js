import { createSlice } from "@reduxjs/toolkit";
export const coachPrivateSlice=createSlice({
    name:"coachPrivate",
    initialState:{
        users:[],
        plans:[],
    },
    
    reducers:{
        setUsers:(state,action)=>{
            state.users=action.payload
        },
        setPlans:(state,action)=>{
            state.plans=action.payload
        },
       addNewPlan:(state,action)=>{
        state.plans=state.plans.push(action.payload)
       },
}})
export const {
   setUsers,
   setPlans,
   addNewPlan
}=coachPrivateSlice.actions;
export default coachPrivateSlice.reducer