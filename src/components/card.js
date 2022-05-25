'use-strict'
import axios from 'axios'
import {useState,useEffect} from 'react'
import usePrevious from '../hooks/usePrevious'
import worker_script from '../workers/timer';
Number.prototype.zeroPad = function() {
    return ('0'+this).slice(-2);
 };
export default function Card(props){
    const [quote,setQuote] = useState("")
    const [running, setRunning ] = useState(0)
    const [color,setColor] = useState("rgba(0, 137, 250, 0.822)")
    const [stage,setStage] = useState(1)
    const [time,setTime] = useState(0)
    const [worker,setWorker] = useState(0);

    useEffect(()=>{ 
        
        const getQuote = async ()=>{
                const reply = await axios.get("https://type.fit/api/quotes")
                let index = Math.floor(Math.random()*(reply.data.length))
                setQuote(reply.data[index])
                
        }

        getQuote()

        setInterval(()=>{
            getQuote()
        },60000)
    },[])

    useEffect(()=>{

        if(running){
            setWorker(()=>{
                let worker = new Worker(worker_script)
                worker.postMessage(time)
                worker.onmessage = e=>{
    
                    setTime(e.data)
                    if(e.data==0){
                        setStage(prev=>prev^1)
                        
                    }
                }
                return worker;
            })

        }else{
            if(worker !==0){
                worker.terminate()
            }
        }
    },[running])
    let prevStage = usePrevious(stage)
    useEffect(()=>{
        const audio = new Audio("https://filebin.net/j38aevo4ka5r6ftu/notification_sound.mp3")
        if(prevStage !== stage){
            audio.play()
        }
        if(stage==1){
            setTime(()=>{
                let time = 25*60;
                if(worker !== 0){
                    worker.postMessage(time)
                }
                return time
            })
            setColor("rgba(0, 137, 250, 0.822)")
        }else{
            setTime(()=>{
                let time = 5*60;
                if(worker !== 0){
                    worker.postMessage(time)
                }
                return time
            })

            setColor("rgba(245, 32, 53, 0.8)")
        }
    },[stage])



    function manageButton(e){
        if(e.target.classList.contains("start")){
            setRunning(1)
            
        }else{
            setRunning(0)
        }
    }
    return(
        <div className="card" style={{backgroundColor : color}}>
            <div className="title"><h1>Prilliant</h1> <p className="small">Brilliant pomodoro timer</p></div>
            <div className="clock">
                <div id="minutes" >{(Math.floor(time/60)).zeroPad()}</div>
                <div className="separator">:</div>
                <div id="seconds">{Math.round(time%60).zeroPad()}</div>
            </div>
            <div className="quote">
                <p>“{quote.text}”</p>
                <p style={{textAlign:"center",marginTop:"10px"}}>- {quote.author}</p>
            </div>
            <div className="buttons">
                <button className="start" onClick={manageButton}>Start</button>
                <button className="stop" onClick={manageButton}>Stop</button>
            
            </div>
            
        </div>
    )
}