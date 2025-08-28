"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Save } from "lucide-react";

enum TechniqueCategory {
  "Nage-Waza" = "nw",
  "Katame-Waza" = "kw",
  "Ukemi-Waza" = "uw",
}

enum TechniqueSubCategory {
  // Nage-Waza
  "Te-Waza" = "tew",
  "Koshi-Waza" = "kow",
  "Ashi-Waza" = "asw",
  "Ma-Sutemi-Waza" = "msw",
  "Yoko-Sutemi-Waza" = "ysw",
  // Katame-Waza
  "Osaekomi-Waza" = "osw",
  "Kansetsu-Waza" = "kaw",
  "Shime-Waza" = "shw",
}

const SubCategoriesMap = {
  [TechniqueCategory["Nage-Waza"]]: [
    TechniqueSubCategory["Te-Waza"],
    TechniqueSubCategory["Koshi-Waza"],
    TechniqueSubCategory["Ashi-Waza"],
    TechniqueSubCategory["Ma-Sutemi-Waza"],
    TechniqueSubCategory["Yoko-Sutemi-Waza"],
  ],
  [TechniqueCategory["Katame-Waza"]]: [
    TechniqueSubCategory["Osaekomi-Waza"],
    TechniqueSubCategory["Kansetsu-Waza"],
    TechniqueSubCategory["Shime-Waza"],
  ],
  [TechniqueCategory["Ukemi-Waza"]]: [],
};

interface Technique {
  id: string;
  name: string;
  name_jp?: string;
  category: TechniqueCategory;
  sub_category?: TechniqueSubCategory;
  kyu: number;
  tkp: number;
  description: string;
}

const TechniqueHeaders: ColumnDef<Technique>[] = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    meta: {
      canEdit: true,
    },
  },
  {
    id: "name_jp",
    header: "Name (JP)",
    accessorKey: "name_jp",
    enableColumnFilter: false,
    size: 100,
  },
  {
    id: "category",
    header: "Category",
    accessorKey: "category",
    enableColumnFilter: true,
    meta: {
      filterVariant: "categories",
      canEdit: true,
    },
  },
  {
    id: "sub_category",
    header: "Sub Category",
    accessorKey: "sub_category",
    enableColumnFilter: false,
  },
  {
    id: "kyu",
    header: "Kyu",
    accessorKey: "kyu",
    size: 40,
    enableColumnFilter: false,
    meta: {
      canEdit: true,
    },
  },
  {
    id: "tkp",
    header: "TKP#",
    accessorKey: "tkp",
    size: 40,
    enableColumnFilter: false,
    meta: {
      canEdit: true,
    },
  },
  {
    id: "description",
    header: "Description",
    accessorKey: "description",
    enableColumnFilter: false,
    size: 320,
    enableResizing: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <div className="grid-cols-2">
          <Edit className="text-sm"></Edit>
          <Save></Save>
        </div>
      );
    },
  },
];

enum KyuLevel {
  "black",
  "brown",
  "blue",
  "green",
  "orange",
  "yellow",
  "white",
}

export {
  TechniqueHeaders,
  type Technique,
  TechniqueCategory,
  TechniqueSubCategory,
  SubCategoriesMap,
  KyuLevel,
};
