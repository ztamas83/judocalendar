import { JSX, useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import useFirebaseData, {
  getUniqueCategories,
  TechniqueCategories,
} from "~/services/firebase-data-service";

import {
  Tab,
  Tabs,
  ListItem,
  ListItemText,
  Typography,
  List,
} from "@mui/material";

export async function clientLoader(): Promise<TechniqueCategories | undefined> {
  const data = await getUniqueCategories();
  if (!data) {
    return undefined;
  }
  return data;
}

export interface Technique {
  id: string;
  name: string;
  name_jp: string;
  category: string;
  sub_category: string;
  level: number;
  description: string;
  // Add other fields as needed
}

// export async function loader() {
//   return {
//     techniques: await useFirebaseData<Technique>("techniques"),
//   };
// }

function groupBy(data: any[], key: string): { [key: string]: any[] } {
  return data.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

export default function Techniques() {
  const { data, isLoading, error } = useFirebaseData<Technique>("techniques");
  const { categories, subCategories } = useLoaderData<TechniqueCategories>();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(
    subCategories[selectedCategory][0]
  );

  const [techniquesByCategory, setTechniquesByCategory] = useState<{
    [key: string]: Technique[];
  }>(
    groupBy(
      data.filter((t) => t.category == selectedCategory),
      "sub_category"
    )
  );

  const renderContent = () => {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error: {error.message}</p>;
    }

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      console.log("New sub category selected: ", selectedCategory, newValue);
      setSelectedSubCategory(newValue);
    };

    return (
      <div className="p-6">
        <Tabs
          value={selectedSubCategory}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {subCategories[selectedCategory].map((sc) => (
            <Tab label={sc} value={sc} />
          ))}
        </Tabs>

        <div
          role="tabpanel"
          // hidden={value !== index}
          id={selectedSubCategory}
          className="p-4"
        >
          <List>
            {techniquesByCategory[selectedSubCategory]?.map((technique) => (
              <ListItem>
                <ListItemText
                  primary={technique.name + " " + technique.name_jp}
                  secondary={technique.description}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    );
  };

  // const [content, setContent] = useState<JSX.Element>(() => renderContent());

  useEffect(() => {
    setSelectedSubCategory(subCategories[selectedCategory][0]);
  }, [selectedCategory]);

  useEffect(() => {
    const groupedTechniques = groupBy(
      data.filter((t) => t.category == selectedCategory),
      "sub_category"
    );
    setTechniquesByCategory(groupedTechniques);
    console.log("groupedTechniques", groupedTechniques);
  }, [data, isLoading, error, selectedCategory]);

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <nav>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-2 rounded ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1">{renderContent()}</main>
    </div>
  );
}
