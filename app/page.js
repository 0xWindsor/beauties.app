'use client';

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";

import NavBar from "@/components/navbar";
import Canvas from "@/components/canvas";
import ImageInput from "@/components/imageInput";
import CategoryNav from "@/components/categories/categoryNav"


const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);


export default function Home() {

    const [image, setImage] = useState(null);       //file
    const [img, setImg] = useState(null);           //objectURL
    const [uimage, setUImage] = useState(null);     //image from Canvas (dataURL
    const [mask, setMask] = useState(null);         //mask from Canvas (dataURL)

    const [woman, setWoman] = useState(false);
    const [man, setMan] = useState(true);

    const [prediction, setPrediction] = useState();
    const [output, setOutput] = useState();

    const userId = "admin";
    const company = "testAdmin";

    const [prompt, setPrompt] = useState({});                   //from CategoryNav
    const [negativePrompt, setNegativePrompt] = useState({});   //from CategoryNav

    var imageUrl;
    var maskUrl;
    var mongoId;


    //--- Handle Functions ---//
    /*
    // @params output       output url from firebase
    // @params id           mongoDB id 
    */

    async function handle() {
        await axios.get('/backend/api/getRunId/')
            .then(async res => {
                mongoId = res.data.runId;

                await firebaseUpload(uimage, "dataurl", "image", "inputs", res.data.runId);
                await firebaseUpload(mask, "dataurl", "mask", "inputs", res.data.runId);

                imageUrl = await firebaseGetUrl(res.data.runId, "image", "inputs");
                maskUrl = await firebaseGetUrl(res.data.runId, "mask", "inputs");

                updateMongo(res.data.runId, imageUrl, maskUrl);

                imageUrl = await fileFromUrl(imageUrl);
                maskUrl = await fileFromUrl(maskUrl);
                await handleInpainting().then(e => {
                    handleOutput(e, res.data.runId)
                });
            })
    }

    async function handleInpainting() {
        return new Promise(async function (resolve, reject) {
            const body = {
                prompt: prompt,
                image: imageUrl,
                mask: maskUrl,
                //invert_mask: true
            }

            const request = await fetch("/api/inpainting/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })
            let response = await request.json();

            setPrediction(response);
            setOutput(response.output);

            resolve(response.output);
        })
    }

    
    async function handleOutput(outputUrl, id) {
        const outputFile = await fileFromUrl(outputUrl)
        await firebaseUpload(outputFile, "file", "output", "outputs", id)
        const url = await firebaseGetUrl(id, "output", "outputs")
        await updateOutput(mongoId, url);
    }


    //--- Firebase and MongoDB Functions ---//
    /* 
    // @params file         file to be uploaded
    // @params fileType     "file" or "dataurl" 
    // @params inputType    "image", "mask" or "output" 
    // @params directory    "inputs" or "outputs" 
    // @params id           mongoDB id 
    // @params imageUrl     image url from firebase
    // @params maskUrl      mask url from firebase
    // @params output       output url from firebase 
    */

    async function firebaseUpload(file, fileType, inputType, directory, id) {
        return new Promise(async function (resolve, reject) {
            const storageRef = ref(storage, `inpainting/users/${userId}/${id}/${directory}/${inputType}_${id}`);

            if (fileType == "file") {
                uploadBytes(storageRef, file).then((snapshot) => { resolve(); });
            } else if (fileType == "dataurl") {
                uploadString(storageRef, file, 'data_url').then((snapshot) => { resolve(); });
            }
        })
    }

    async function firebaseGetUrl(id, inputType, directory) {
        return new Promise(async function (resolve, reject) {
            getDownloadURL(ref(storage, `inpainting/users/${userId}/${id}/${directory}/${inputType}_${id}`))
                .then((url) => {
                    resolve(url);
                    return url;
                })
        })
    }

    async function updateMongo(id, imageUrl, maskUrl) {
        const data = {
            user: userId,
            company: company,
            prompt: prompt,
            image: imageUrl,
            mask: maskUrl,
            output: userId,
        }

        await axios.post(`/backend/api/createReq/${id}/`, data)
            .then(response => {
            })
            .catch(error => {
                console.log(error);
            });
    }

    async function updateOutput(id, output) {
        const data = {
            output: output
        }

        await axios.post(`/backend/api/createOutput/${id}/`, data)
    }


    //--- Canvas & Image Functions ---//

    function userImageUpload(e) {
        setImage(e.target.files[0])

        let url = URL.createObjectURL(e.target.files[0]);
        setImg(url);
    }


    //--- Helpers ---//

    async function fileFromUrl(url) {
        const blob = await (await fetch(url)).blob();
        const file = new File([blob], 'fileName.jpg', { type: "image/jpeg" });

        return file
    }
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));


    return (
        <main className='h-screen bg-gradient-to-r from-cyan-500 to-blue-500 before-hero'>
            <NavBar />

            <section className='container mx-auto px-6 md:px-12 py-6'>
                <div className="block lg:flex items-start gap-12">
                    {/* LEFT BLOCK */}
                    <div className="block">

                        {/* WOMAN & MAN BUTTONS */}
                        <div className="flex items-center gap-4 justify-between">
                            {/* WOMAN BUTTON */}
                            <div className={woman ?
                                "text-center w-[300px] py-4 rounded-lg text-blue-500 bg-white cursor-pointer lg:z-50"
                                :
                                "text-white text-center w-[300px] py-4 rounded-lg bg-opacity-30 bg-white cursor-pointer lg:z-50"}
                                onClick={() => { setWoman(true); setMan(false) }}>Woman</div>

                            {/* MAN BUTTON */}
                            <div className={man ?
                                "w-[300px] text-center py-4 rounded-lg text-blue-500 bg-white cursor-pointer"
                                :
                                "text-white w-[300px] text-center py-4 rounded-lg bg-opacity-30 bg-white cursor-pointer"}
                                onClick={() => { setMan(true); setWoman(false) }}>Man</div>
                        </div>

                        {/* IMAGE INPUT */}
                        {!image ? <div className="bg-white rounded-lg my-8 flex items-center justify-center">
                            <ImageInput onChange={(e) => userImageUpload(e)} />
                        </div> : null}

                        {/* CANVAS (INCLUDES BUTTONS) */}
                        {image ? (
                            <Canvas image={img} setMask={setMask} setImage={setUImage} submit={handle} />
                        ) : null}

                    </div>

                    {/* RIGHT BLOCK */}
                    <div className="block">
                        {/* CATEGORY NAV */}
                        <div className="block grid-cols-2 lg:flex items-center gap-4">
                            <CategoryNav setPrompt={setPrompt} setNegativePrompt={setNegativePrompt} />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
