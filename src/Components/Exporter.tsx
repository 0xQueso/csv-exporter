import {useCallback, useState} from "react";
import { useDropzone } from "react-dropzone";
// @ts-ignore
import { CSVLink, CSVDownload } from "react-csv";
import { readString } from 'react-papaparse'
import json2csv from "json-2-csv";

import {Box, Button, Flex, Input, Stack, Text} from "@chakra-ui/react";
// import "react-table/react-table.css";

let filter = [
    'Joe',
    '6'
]
let filter1 = {
        name:'Joe',
        result:'6'
}


export default function Exporter() {
    const [data, setData] = useState("")
    const [dl, setDl] = useState("")
    const [filters, setFilter] = useState({
        name: "",
        status: ""
    })

    const [name, setName] = useState()
    const [status, setStatus] = useState()
    const [fileName, setFileName] = useState('file')

    let config = {
        worker: true,
        complete: (results:any) => {
            // @ts-ignore
            // var filteredArray = results.data.filter(i => {
            //     return i['Doctor First Name'] == name && i['Test Result'] == status
            // });
            // @ts-ignore
            setData(results.data)
        },
        header:true
    }



    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading failed");
        reader.onload = () => {
            console.log('asd')
            // @ts-ignore
            readString(reader.result, config)
        };

        // read file contents
        acceptedFiles.forEach((file: Blob) => reader.readAsBinaryString(file));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    let json2csvCallback = (err:any, csv:any) => {
        if (err) throw err;
        console.log(csv, "MATE");
        setDl(csv)
    };

    const toCSV = () => {
        // @ts-ignore
        // let datas = json2csv(data);
        console.log(data)
        // @ts-ignore
        json2csv.json2csv(data, json2csvCallback)
    }
    const applyFilter = () => {
        // @ts-ignore
        let newData = data.filter(i => {
            if (i['Test Result'] == status) {
                setFileName('Covid-PCR');
            } else if (i['COVID-19 ANTIGEN'] == status) {
                setFileName('Covid-Antigen');
            }
                return i['Doctor First Name'] == name && (i['Test Result'] == status || i['COVID-19 ANTIGEN'] == status )
            });
        setData(newData)
        console.log(newData, 'filtering')

    }

    // @ts-ignore
    return (
        <>

            <Flex justifyContent={"center"} height={"100vh"} alignItems={"center"}>

                <Box w={"50%"} p={10}>
                    <Stack spacing={3}>
                        <Input placeholder='Doctor' size='md' onChange={(v) => {
                            // @ts-ignore
                            setName(v.target.value);
                            console.log(v.target.value)
                        }}/>
                        <Input placeholder='Test Result' size='md' onChange={(v) => {
                            // @ts-ignore
                            setStatus(v.target.value);
                        }}/>
                    </Stack>
                    <Button mt={4} onClick={applyFilter}> Apply</Button>


                </Box>
                    <Box> <Button mr={5} onClick={toCSV}>↔</Button> </Box>
                <Box w={"50%"} p={10}>
                    <Box className="App" {...getRootProps()} height={250} border={"dashed 2px black"}>
                        <input {...getInputProps()} />
                        <p>Drop 'n' Drop some files here or click to upload</p>
                    </Box>

                    <CSVLink data={dl} filename={fileName}>
                        <Text border={"solid 1px black"} p={2}> Download  </Text>
                    </CSVLink>
                </Box>
            </Flex>



        </>
    )
}