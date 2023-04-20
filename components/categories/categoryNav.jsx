import { useState, useEffect } from "react";
import axios from "axios";

import CategoryList from "./categoryList";

// Company Structure
/*
{
    "_id": "id",
    "name": "testCompany",
    "status": "active",
    "categories": {
        "category": {
            "sub_category": [
                {
                    "name": "Name",
                    "image": "url",
                    "prompt": "prompt",
                    "negativePrompt": "negative prompt"
                }
            ],

        }
    }
}

*/


export default function CategoryNav(props) {

    const [state, setState] = useState("");
    const [categories, setCategories] = useState();

    useEffect(() => {
        handle();
    }, [])

    async function handle() {
        await axios.get('/backend/api/getInfo/64404947e52a9724d3a1ffd9')
            .then(res => {
                const categories = res.data.categories; //{category, category, item}
                delete categories.item;
                delete categories.subCategory; //????????????????????????????????????????????
                setCategories(categories);
                setState(Object.entries(categories)[0][0]);
            });
    }

    function handleMenuClick(e) {
        setState(e.target.value)
    }

    return (
        <div>
            <div className="grid grid-cols-2 lg:flex items-center gap-4">
                {categories ? (
                    Object.entries(categories).map((i, key) => //[[categoryName, category], ...]
                        <button className={(state === i[0]) ?
                            "text-blue-500 text-center py-4 px-12 rounded-lg  bg-white cursor-pointer"
                            : "text-white text-center py-4 px-12 rounded-lg bg-opacity-30 bg-white cursor-pointer"}
                            key={key} value={i[0]} onClick={e => handleMenuClick(e)}>{i[0]}</button>
                    )
                ) : null}
            </div>

            {state && <CategoryList setPrompt={props.setPrompt} setNegativePrompt={props.setNegativePrompt} category={categories[state]} />}
        </div>
    )
}
