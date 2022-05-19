'use-strict'
import axios from 'axios'
import {useState,useEffect} from 'react'
Number.prototype.zeroPad = function() {
    return ('0'+this).slice(-2);
 };
export default function Card(props){
    const [quote,setQuote] = useState("")
    const [color,setColor] = useState("rgba(0, 137, 250, 0.822)")
    const [stage,setStage] = useState(1)
    const [intervalid,setIntervalID] = useState(0)

    useEffect(()=>{
        document.querySelectorAll("button").forEach(item=>{
            item.addEventListener("click",(e)=>{
                buttonHandler(e)
            })
        })
        const getQuote = async ()=>{
                const reply = await axios.get("https://zenquotes.io/api/random")
                setQuote(reply.data[0].q)
        }

        getQuote()

        setInterval(()=>{
            getQuote()
        },60000)
    },[])
    const buttonHandler = (e) =>{
        if(e.target.classList.contains("start")){
            setStage(1)
        }else if(e.target.classList.contains("stop")){
            setStage(0)
        }
    }
    useEffect(()=>{
        console.log(stage)
        if(stage==1){
            setColor("rgba(0, 137, 250, 0.822)")
            document.getElementById("minutes").innerText="24"
            document.getElementById("seconds").innerText="59"
            let id = setInterval(()=>{
                let minutes = document.getElementById("minutes")
                let seconds = document.getElementById("seconds")
                let minutesNO = Number(minutes.innerText)
                let secondsNO = Number(seconds.innerText)
                if(minutesNO==0 && secondsNO ==0 ){
                    setStage(0)
                }else if(secondsNO ==0){
                    minutes.innerText = (minutesNO-1).zeroPad()
                    seconds.innerText = "59"
                }else{
                    
                    seconds.innerText = (secondsNO-1).zeroPad()
                }

            },1000)
            setIntervalID(id)
        }
        if(stage == 0){
            
            clearInterval(intervalid)
            setColor("rgba(245, 40, 52, 1)")
        }
    },[stage])

    return(
        <div className="card" style={{backgroundColor : color}}>
            <div className="title"><h1>Prilliant</h1> <p className="small">Brilliant pomodoro timer</p></div>
            <div className="clock">
                <div id="minutes">24</div>
                <div className="separator">:</div>
                <div id="seconds">59</div>
            </div>
            <div className="quote">
                <p>“{quote}”</p>
            </div>
            <div className="buttons">
                <button className="start">Start</button>
                <button className="stop">Stop</button>
            
            </div>
        </div>
    )
}