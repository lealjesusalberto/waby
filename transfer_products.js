import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import fs from "fs";

// Simple dotenv parser
const envContent = fs.readFileSync(".env", "utf-8");
const envVars = {};
envContent.split("\n").forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});
process.env = { ...process.env, ...envVars };

let fileContent = fs.readFileSync("./src/firebase.js", "utf-8");
fileContent = fileContent.replace(/import\.meta\.env/g, "process.env");
const configMatch = fileContent.match(/const firebaseConfig = ({[\s\S]*?});/);

const firebaseConfig = eval("(" + configMatch[1] + ")");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const WABY_STORE_ID = "4mUFDPNHjFUipkNjyI6xPlk1tjJ3";
const PRODUCT_IDS = ["1785348323060", "1785357799696", "1785442428678"];

async function run() {
  for (const id of PRODUCT_IDS) {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        storeId: WABY_STORE_ID
      });
      console.log(`Updated product ${id} -> ${WABY_STORE_ID}`);
    } catch (err) {
      console.error(`Failed to update ${id}`, err);
    }
  }
  process.exit(0);
}
run();
