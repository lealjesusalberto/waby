import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
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

if (!configMatch) {
  console.log("Could not find firebaseConfig");
  process.exit(1);
}

const firebaseConfig = eval("(" + configMatch[1] + ")");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const q = collection(db, "products");
  const snapshot = await getDocs(q);
  console.log("Found " + snapshot.docs.length + " products");
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log("Product ID:", doc.id, "Store ID:", data.storeId, "Name:", data.name, "Category:", data.categoryId);
  });
  process.exit(0);
}
run();
