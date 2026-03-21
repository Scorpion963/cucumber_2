"use client"

import { idb } from "@/db/db"
import { message } from "db"
import { useEffect } from "react"

// TODO: use this function to initialize/update the data inside of the indexedDB, the data should come from the layout 
// basically this function needs to have to methods, one for checking what's different, and one for udpating the different parts

export default function Initialize({data}: {data: typeof message.$inferSelect}){
    useEffect(() => {
        async function populate(){
            try{
                const id = await idb.messages.add(data)
            }catch{
                console.log("Error updating indexed db happened")
            }
        }
    }, [data])

    return <></>
}