
const workercode = () => {
    
    let interval;
    onmessage = function(e) {
        let time=e.data;
        if(interval !== undefined){
            this.clearInterval(interval)
        }
        interval = setInterval(()=>{
            time = time-1
            this.postMessage(time)
        },1000)
        
    }
    
};

let code = workercode.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

const blob = new Blob([code], {type: "application/javascript"});
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;