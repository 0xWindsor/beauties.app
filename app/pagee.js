'use client';
import { useState } from "react";
import axios from "axios";

import NavBar from "@/components/navbar";
import ImageInput from "@/components/imageInput";
import Canvas from "@/components/canvas";
import CategoryNav from "@/components/categories/categoryNav"

export default function Home() {

    const [woman, setWoman] = useState(false);
    const [man, setMan] = useState(true);

    const [image, setImage] = useState(null);       //file
    const [img, setImg] = useState(null);           //objectURL
    const [uimage, setUImage] = useState(null);     //image from Canvas (dataURL)
    const [mask, setMask] = useState(null);         //mask from Canvas (dataURL)

    const [prompt, setPrompt] = useState({});                   //from CategoryNav
    const [negativePrompt, setNegativePrompt] = useState({});   //from CategoryNav

    var mongoId;




    function userImageUpload(e) {
        console.log("userImageUpload(e)", "e.target.files[0]", "⌄")
        console.log(e.target.files[0])
        setImage(e.target.files[0])

        let url = URL.createObjectURL(e.target.files[0]);
        setImg(url);
        //console.log(url)
    }

    async function handle() {
        await axios.get('/backend/api/getRunId/')
            .then(async res => {
                mongoId = res.data.runId;

                await handleInpainting().then(e => {
                    console.log(e)
                });
            })

    }

    async function handleInpainting() {
        return new Promise(async function (resolve, reject) {

            console.log(mask)
            console.log(uimage)

            const body = {
                prompt: prompt,
                //image: imageFile,
                //mask: maskFile,
            }

            const request = await fetch("/api/inpainting/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })

            const response = await request.json();

            console.log(response);
        })
    }

    async function dataURLToFile(dataURL) {
        const blob = await (await fetch(dataURL)).blob();
        const file = new File([blob], 'fileName.jpg', { type: "image/jpeg", lastModified: new Date() });
        return file;
    }

    function kerem(){
        console.log(mask)
        console.log(uimage)
    }

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
                            <Canvas image={img} setMask={mask} setImage={setUImage} submit={handle} />
                        ) : null}
                    </div>

                    {/* RIGHT BLOCK */}
                    <div className="block">
                        {/* CATEGORY NAV */}
                        <div className="block grid-cols-2 lg:flex items-center gap-4">
                            <CategoryNav setPrompt={setPrompt} setNegativePrompt={setNegativePrompt} />
                        </div>

                        {/* <CategoryList /> */}
                    </div>
                </div>
            </section>

            <button onClick={kerem}>kerem</button>
        </main>
    )
} 