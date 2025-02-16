"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Save } from "lucide-react";

interface Technique {
  id: string;
  name: string;
  name_jp: string;
  category: string;
  sub_category: string;
  level: number;
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

export { TechniqueHeaders, type Technique };
