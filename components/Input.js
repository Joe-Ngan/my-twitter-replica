import React, { useState, useRef } from 'react'
import {
    CalendarIcon,
    ChartBarIcon,
    EmojiHappyIcon,
    PhotographIcon,
    XIcon,
} from "@heroicons/react/outline";

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { db, storage } from "../firebase";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from '@firebase/firestore';
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { async } from '@firebase/util';
import { useSession } from "next-auth/react";


function Input() {
    const [input, setInput] = useState("");
    const [file, setFile] = useState(null);
    const [showEmojis, setShowEmojis] = useState(false);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    
    const filePickerRef = useRef(null);


    const sendPost = async () => {
        if (loading) return;
        setLoading(true);

        const docRef = await addDoc(collection(db, "posts"), {
            id: session.user.uid,
            username: session.user.name,
            userImg: session.user.image,
            tag: session.user.tag,
            text: input,
            timestamp: serverTimestamp(),
        })

        const imageRef = ref(storage, `posts/${docRef.id}/image`);

        if (file) {
            await uploadString(imageRef, file, "data_url")
                .then(async () => {
                    const downloadURL = await getDownloadURL(imageRef)
                    await updateDoc(doc(db, "posts", docRef.id), {
                        image: downloadURL,
                    });
                });
        }

        setLoading(false);
        setInput("");
        setFile(null);
        setShowEmojis(false);
    };

    const addImageToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            setFile(readerEvent.target.result);
        };
    };

    const addEmoji = (e) => {
        let symbol = e.unified.split("-");
        let codesArray = [];
        symbol.forEach((elelemt) => codesArray.push("0x" + elelemt));
        let emoji = String.fromCodePoint(...codesArray);
        setInput(input + emoji);
    };

    return (
        <div className={`border-b border-gray-700 p-3 flex space-x-3 overflow-y-scroll ${loading && "opacity-60"}`}>
            <img
                src={session.user.image}
                alt=""
                className="h-11 w-11 rounded-full cursor-pointer"
            />
            <div className="w-full divide-y divide-gray-700">
                <div className={`${file && "pb-7"} ${input && "space-y-2.5"}`}>
                    <textarea
                        value={input}
                        rows="3"
                        placeholder="what's happening?"
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full min-h-[50px] bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-white"
                    />
                    {file && (
                        <div className="relative">
                            <div className="absolute w-8 h-8 bg-[#15181c]
                             hover:bg-[#272c26] bg-opacity-75 rounded-full flex
                              items-center justify-center top-1 left-1 cursor-pointer"
                                onClick={() => setFile(null)}>
                                <XIcon className="text-white h-5" />
                            </div>
                            <img src={file}
                                alt=""
                                className="rounded-2xl max-h-80 object-contain"
                            />
                        </div>
                    )}
                </div>
                {!loading && (
                    <div>
                        <div className="flex items-center justify-between pt-2.5">
                            <div className="flex items-center">
                                <div className="icon"
                                    onClick={() => filePickerRef.current.click()}>
                                    <PhotographIcon className="h-[22px] text-[#1d9bf0]"></PhotographIcon>
                                    <input
                                        type="file"
                                        onChange={addImageToPost}
                                        hidden
                                        ref={filePickerRef}
                                    />
                                </div>
                                <div className="icon rotate-90">
                                    <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
                                </div>

                                <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
                                    <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
                                </div>

                                <div className="icon">
                                    <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
                                </div>

                                {showEmojis && (
                                    <Picker
                                        onSelect={addEmoji}
                                        style={{
                                            position: "absolute",
                                            marginTop: "465px",
                                            marginLeft: -40,
                                            maxWidth: "320px",
                                            borderRadius: "20px",
                                        }}
                                        theme="dark"
                                    />
                                )}
                            </div>
                            <button
                                className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                                disabled={!input && !file}
                                onClick={sendPost}
                            >Tweet</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Input
