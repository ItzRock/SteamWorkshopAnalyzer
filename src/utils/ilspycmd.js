const { exec } = require("child_process");
const decompdll = (path) => {
    let command = "ilspycmd " + path;
    const myPromise = new Promise((resolve, reject) => {
        const ilspycmd = exec(command, (error, stdout, stderr)=>{
            if(error){
                console.log(`exec error (this is your fault): ${error}`)
            } else 
            resolve( {data: stdout, error: stderr} )
        });
    });
    return myPromise
};
module.exports = decompdll
