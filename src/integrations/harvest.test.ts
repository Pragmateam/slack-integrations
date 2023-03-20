import { addAvacadoUser, getAllAvacadoUsers } from "../utils/dynamo";
import { getLatestTasks } from "./harvest";

// getLatestTasks("570020", "2889815.pt.EkaxBinJjuHTpIHjaZptv5n6fL8JnaKzrXbag-jVlrSKyqBTFYUDoaePgCLhelPpv2NWlFdbWJPKh1wZOdZrEA")
// .then((tasks) => {
//   console.dir({ tasks }, { depth: 4})
// });

// addAvacadoUser({slackID: "7777", harvestAcccountID: "8888", harvestPAT: "9999"}).then(console.log);
getAllAvacadoUsers().then(console.log);
