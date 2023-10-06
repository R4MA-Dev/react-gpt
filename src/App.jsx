import { useEffect, useRef, useState } from 'react'
import { Configuration, OpenAIApi } from 'openai'
import chatpgtLogo from "./assets/chatgpt-logo.png"
import { FaTrash } from "react-icons/fa"
import './App.css'

function App() {

    const getData = localStorage.getItem("chat")

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [previousResponse, setPreviousResponse] = useState("")

    const inputText = useRef(null)
    const chat = useRef(null)
    const spinner = useRef(null)
    const btnDelete = useRef(null)

    useEffect(()=>{
        if(getData !== null){
            chat.current.innerHTML = getData
        }else{
            chat.current.innerHTML = ""
        }
    }, [])

    useEffect(()=>{
        if(data.length !== 0){
            const bot = document.createElement("pre")

            bot.textContent = data
            bot.setAttribute("class", "message")
    
            chat.current.appendChild(bot)

            localStorage.setItem("chat", chat.current.innerHTML)
        }
    }, [data])

    useEffect(()=>{
        if(spinner.current !== null){
            spinner.current.scrollIntoView()
        }
    }, [data])

    
    //Consigue tu API-KEY en https://platform.openai.com/account/api-keys
    //Give your API-KEY in https://platform.openai.com/account/api-keys
    const apiKey = "YOUR API-KEY HERE"

    const configuration = new Configuration({apiKey})
    const openAi = new OpenAIApi(configuration)

    const chatgpt = async(e)=>{
        btnDelete.current.setAttribute("disabled", "true")
        e.preventDefault()

        setData([])
        setLoading(true)

        const me = document.createElement("p")

        me.textContent = inputText.current.value
        me.setAttribute("class", "message")

        chat.current.appendChild(me)

        localStorage.setItem("chat", chat.current.innerHTML)

        const model = "gpt-3.5-turbo"
        const messages = [
            {
                role : "user",
                content : inputText.current.value
            },
            {
                role : "assistant",
                content : previousResponse
            }
        ]

        inputText.current.value = ""

        const completation = await openAi.createChatCompletion({
            model,
            messages
        })

        setData(completation.data.choices[0].message.content)
        setPreviousResponse(completation.data.choices[0].message.content)
        setLoading(false)
        

        btnDelete.current.removeAttribute("disabled")
    }

    const clearChat = ()=>{
        localStorage.removeItem("chat")
        chat.current.innerHTML = ""
    }

return (
    <div id="content">
        <div id="panel">
                <span>REACT-GPT <img src={chatpgtLogo} /></span>
                <button ref={btnDelete} title='Clear Chat' onClick={clearChat}><FaTrash /></button>
        </div>
        <div id="chat-container">
            <div id="chat" ref={chat}>
            {
                data.length === 0 && loading === true
                ? 
                <div>
                    <div ref={spinner} className="spinner"></div>
                </div>
                : <></>
            }
            </div>
        </div>

        <form>
        <input ref={inputText} type="text" />
        <input type="submit" title="Send Message" onClick={chatgpt} value="➤"/>
        </form>
    </div>
    )
}

export default App
