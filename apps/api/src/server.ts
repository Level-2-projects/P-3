import "dotenv/config";
import {app} from "./app.js";


const PORT = Number(process.env.PORT ?? 3000); // port

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// server will run on port this port



