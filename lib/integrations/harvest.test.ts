import { getLatestTasks } from "./harvest";

getLatestTasks("570020", "2889815.pt.EkaxBinJjuHTpIHjaZptv5n6fL8JnaKzrXbag-jVlrSKyqBTFYUDoaePgCLhelPpv2NWlFdbWJPKh1wZOdZrEA")
.then((tasks) => {
  console.dir({ tasks }, { depth: 4})
});
