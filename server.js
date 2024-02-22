const config = require("./app/config")
const app = require("./app")


const PORT = config.app.port;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}.`);

})