import { useState } from "react";
import useFirebaseData from "~/services/techniques-service";

type TechniqueCategory = "nage-waza" | "osae-komi-waza";
export interface Technique {
  id: string;
  name: string;
  name_jp: string;
  category: TechniqueCategory;
  level: number;
  description: string;
  // Add other fields as needed
}

export default function Techniques() {
  const { data, isLoading, error } = useFirebaseData<Technique>("techniques");

  const [selectedCategory, setSelectedCategory] =
    useState<TechniqueCategory>("nage-waza");

  const renderContent = () => {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error: {error.message}</p>;
    }

    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{selectedCategory}</h2>
        <div className="grid grid-cols-3 gap-4">
          {data
            .filter((t) => t.category == selectedCategory)
            .map((st) => {
              return (
                <div key={st.id} className="border p-4 rounded-lg">
                  <h3 className="font-bold">{st.name}</h3>
                  <p>{st.description}</p>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  // return (
  //   <div className="p-6">
  //     <h2 className="text-2xl font-bold mb-4">Osae Komi Waza (抑込技)</h2>
  //     <div className="grid grid-cols-3 gap-4">
  //       <div className="border p-4 rounded-lg">
  //         <h3 className="font-bold">Kesa Gatame</h3>
  //         <p>Scarf hold</p>
  //       </div>
  //       <div className="border p-4 rounded-lg">
  //         <h3 className="font-bold">Yoko Shiho Gatame</h3>
  //         <p>Side four corner hold</p>
  //       </div>
  //       <div className="border p-4 rounded-lg">
  //         <h3 className="font-bold">Kami Shiho Gatame</h3>
  //         <p>Upper four corner hold</p>
  //       </div>
  //     </div>
  //   </div>
  // );
  //   }
  // };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <nav>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setSelectedCategory("nage-waza")}
                className={`w-full text-left px-4 py-2 rounded ${
                  selectedCategory === "nage-waza"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Nage Waza
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedCategory("osae-komi-waza")}
                className={`w-full text-left px-4 py-2 rounded ${
                  selectedCategory === "osae-komi-waza"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Osae Komi Waza
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1">{renderContent()}</main>
    </div>
  );
}
