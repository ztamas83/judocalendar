import { JSX, useEffect, useState } from "react";
import useFirebaseData, {
  TechniqueCategories,
} from "~/services/firebase-data-service";
import { Technique } from "~/models/technique";
import { Tab, Tabs, ListItem, ListItemText, List } from "@mui/material";
import { useUserData } from "~/services/user-data-hook";
import { TechniquesAdmin } from "~/components/techniques-admin";
import { groupBy } from "~/utils";
import { Circle } from "lucide-react";

export default function Techniques() {
  const [isLoggedIn, userData] = useUserData();
  const { data, isLoading, error } = useFirebaseData<Technique>("techniques");

  const [selectedSubPage, setSelectedSubPage] = useState<string>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [categoryData, setCategoryData] = useState<TechniqueCategories>();

  useEffect(() => {
    if (data && !isLoading) {
      const categories = new Set<string>();
      const subCategories: { [key: string]: Set<string> } = {};

      data.forEach((doc) => {
        const category = doc.category;
        categories.add(category);
        if (!subCategories[category]) {
          subCategories[category] = new Set<string>();
        }
        subCategories[category].add(doc.sub_category);
      });

      console.log("Categories:", categories);
      console.log("Sub-categories:", subCategories);

      setCategoryData({
        categories: Array.from(categories),
        subCategories: Object.keys(subCategories).reduce((dict, key) => {
          dict[key] = Array.from(subCategories[key]);
          return dict;
        }, {} as { [key: string]: string[] }),
      });
    }
  }, [data, isLoading]);

  // const categoryData = useLoaderData<TechniqueCategories>();

  const [techniquesByCategory, setTechniquesByCategory] = useState<{
    [key: string]: Technique[];
  }>();

  const renderContent = () => {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error: {error.message}</p>;
    }

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      console.log("New sub category selected: ", selectedSubPage, newValue);
      setSelectedSubCategory(newValue);
    };

    if (!selectedSubPage) {
      return <p>Select a category</p>;
    }

    if (selectedSubPage === "admin") {
      return <TechniquesAdmin />;
    }

    function BeltIndicator({
      technique,
    }: {
      technique: Technique;
    }): JSX.Element {
      let color = "white";

      console.log("Handling technique", technique);

      switch (+technique.kyu) {
        case 5:
          color = "yellow";
          break;
        case 4:
          color = "orange";
          break;
        case 3:
          color = "green";
          break;
        case 2:
          color = "blue";
          break;
        case 1:
          color = "brown";
          break;
        default:
          return <Circle fill="white" size={10} />;
      }

      console.log("Selected color", color);

      return <Circle fill={color} color={color} size={10} />;
      // return <div className="bg-{color} fill-amber-200" />;
    }

    return categoryData && selectedSubPage ? (
      <div className="p-6">
        <Tabs
          value={selectedSubCategory}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {categoryData.subCategories[selectedSubPage].map((sc) => (
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
            {techniquesByCategory![selectedSubCategory]?.map((technique) => (
              <ListItem>
                <div className="align-middle">
                  <BeltIndicator technique={technique} />
                  <ListItemText
                    primary={technique.name + " " + technique.name_jp}
                    secondary={technique.description}
                  />
                </div>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    ) : null;
  };

  // const [content, setContent] = useState<JSX.Element>(() => renderContent());

  useEffect(() => {
    if (categoryData && selectedSubPage && selectedSubPage !== "admin") {
      setSelectedSubCategory(categoryData?.subCategories[selectedSubPage][0]);
    }
  }, [selectedSubPage]);

  useEffect(() => {
    const groupedTechniques = groupBy(
      data.filter((t) => t.category == selectedSubPage),
      "sub_category"
    );
    setTechniquesByCategory(groupedTechniques);
    console.log("groupedTechniques", groupedTechniques);
  }, [data, isLoading, error, selectedSubPage]);

  return (
    <div className="grid grid-cols-[200px_auto] gap-4 h-screen">
      <aside className="flex-1 xbg-gray-100 p-4">
        <nav>
          <ul className="space-y-2">
            {categoryData?.categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => setSelectedSubPage(category)}
                  className={`w-full text-left px-4 py-2 rounded ${
                    selectedSubPage === category
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
            {isLoggedIn && userData?.isAdmin ? (
              <li>
                <button
                  className="w-full text-left px-4 py-2 rounded hover:bg-gray-200"
                  onClick={() => setSelectedSubPage("admin")}
                >
                  Admin
                </button>
              </li>
            ) : null}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 w-auto items-center justify-around pt-4 pl-8">
        {renderContent()}
      </main>
    </div>
  );
}
