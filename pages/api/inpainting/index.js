import { NextApiResponse, NextApiRequest } from 'next'
import axios from "axios";

export default async function handler(
    req,
    res
) {
    const engineId = 'stable-inpainting-512-v2-0';
    const apiHost = 'https://api.stability.ai';

    const formData = new FormData();
    formData.append('init_image', req.body.image)
    formData.append('mask_image', req.body.mask)
    formData.append('text_prompts[0][text]', req.body.prompt)

    formData.append('mask_source', 'MASK_IMAGE_BLACK')
    formData.append('clip_guidance_preset', 'FAST_BLUE')
    formData.append('cfg_scale', 8)
    formData.append('samples', 10)
    formData.append('steps', 30)

    const response = await fetch(
        `${apiHost}/v1/generation/${engineId}/image-to-image/masking`,
        {
            method: 'POST',
            headers: {
                formData,
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
            },
            body: formData,
        }
    )

    const responseJSON = await response.json();
    res.end(JSON.stringify(responseJSON));
}
