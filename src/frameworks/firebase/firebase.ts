import * as admin from "firebase-admin";
import * as path from "path";

const dirname = process.env.FB_SDK_DIR!;
const filename = process.env.FB_SDK_NAME!;

const root = process.env.NODE_PATH!;

const servicePath = path.join(root, dirname, filename);
const serviceAccount = require(servicePath);

export default function initFirebase() {
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tama-project-med.firebaseio.com"
  });

  return app;
}
