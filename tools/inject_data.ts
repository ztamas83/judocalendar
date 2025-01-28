import {
  collection,
  doc,
  getFirestore,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

import { firebaseConfig } from "./fb";
import { DateTime } from "luxon";

import fs from "fs";
import { db } from "./firebase.server";

async function injectData(jsonPath: string) {
  try {
    // Read and parse JSON file
    const rawData = fs.readFileSync(jsonPath, "utf8");
    const documents = JSON.parse(rawData);

    if (!Array.isArray(documents)) {
      throw new Error("JSON file must contain an array of documents");
    }

    // Get collection name from file name
    const collectionName = "techniques"; // Assuming the file name is the collection name
    const collectionRef = db.collection(collectionName);

    const existingDocs = await collectionRef.get();

    existingDocs.docs.forEach((doc) => {
      console.log(doc.data());
    });

    // Upload documents
    for (const doc_data of documents) {
      const docRef = collectionRef.doc(doc_data.id);
      await docRef.set({
        ...doc_data,
        createdAt: DateTime.now().toISO(),
        updatedAt: DateTime.now().toISO(),
      });
      console.log(`Uploaded document ${docRef.id}`);
    }

    console.log(
      `Successfully uploaded ${documents.length} documents to ${collectionName}`
    );
  } catch (error) {
    console.error("Error injecting data:", error);
    process.exit(1);
  }
}

// Get JSON path from command line arguments
const jsonPath = process.argv[2];

if (!jsonPath) {
  console.error("Please provide a path to the JSON file");
  process.exit(1);
}

injectData(jsonPath)
  .then(() => {
    console.log("Data injection completed");
  })
  .catch((error) => {
    console.error("Error:", error);
  });
